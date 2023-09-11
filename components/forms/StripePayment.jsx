import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentElement, AddressElement, LinkAuthenticationElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useAuth, useUser } from '@clerk/clerk-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const STRIPE_PAYMENT_INTENT_API = '/api/v1/payments/stripe/intent';

export default function StripePayment({ order }) {
	const [clientSecret, setClientSecret] = useState('');
	const authData = useAuth();
	const userData = useUser();
	const { amount } = order;

	useEffect(() => {
		console.log('Stripe Client Updated');
		// Create PaymentIntent as soon as the page loads
		fetch(STRIPE_PAYMENT_INTENT_API, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				amount: order.amount,
				metadata: {
					slot: '1',
					first_name: userData.user.firstName,
					last_name: userData.user.lastName,
					user_id: userData.user.id,
					email: userData.user.primaryEmailAddress.emailAddress,
					// Order ID from the orders table
					order_id: order.id,
					amount: order.amount,
					type: order?.type,
				},
			}),
		})
			.then(res => res.json())
			.then(data => setClientSecret(data.clientSecret));
	}, [amount]);

	const appearance = {
		theme: 'stripe',
	};
	const options = {
		clientSecret,
		appearance,
	};

	return (
		<>
			<section className="w-full max-w-lg mx-auto my-3 overflow-y-auto">
				{clientSecret && (
					<Elements options={options} stripe={stripePromise}>
						<StripePaymentForm amount={amount} />
					</Elements>
				)}
			</section>
		</>
	);
}

export function StripePaymentForm({ slot = 21, amount, setAmount }) {
	const stripe = useStripe();
	const elements = useElements();
	const [formData, setFormData] = useState({ slot: slot });
	const [required, setRequired] = useState(false);

	const [email, setEmail] = useState('');
	const [addressObject, setAddressObject] = useState(null);
	const [message, setMessage] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!stripe) {
			return;
		}

		const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret');

		if (!clientSecret) {
			return;
		}

		stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
			switch (paymentIntent.status) {
				case 'succeeded':
					setMessage('Payment succeeded!');
					break;
				case 'processing':
					setMessage('Your payment is processing.');
					break;
				case 'requires_payment_method':
					setMessage('Your payment was not successful, please try again.');
					break;
				default:
					setMessage('Something went wrong.');
					break;
			}
		});
	}, [stripe]);

	const handleSubmit = async e => {
		e.preventDefault();
		console.log('Pay now: submit');

		try {
			if (!stripe || !elements) {
				// Stripe.js hasn't yet loaded.
				// Make sure to disable form submission until Stripe.js has loaded.
				return;
			}

			setIsLoading(true);

			console.log(elements);

			const { error } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					// Make sure to change this to your payment completion page
					return_url: 'http://localhost:3000',
				},
			});

			// This point will only be reached if there is an immediate error when
			// confirming the payment. Otherwise, your customer will be redirected to
			// your `return_url`. For some payment methods like iDEAL, your customer will
			// be redirected to an intermediate site first to authorize the payment, then
			// redirected to the `return_url`.
			if (error.type === 'card_error' || error.type === 'validation_error') {
				setMessage(error.message);
			} else {
				setMessage('An unexpected error occurred.');
			}

			setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

	const paymentElementOptions = {
		layout: 'tabs',
		billingDetails: {
			name: 'Jenny Rosen',
			email: '',
			phone: '',
			address: {
				city: '',
				line1: '',
				line2: '',
				state: '',
				postal_code: '',
			},
		},
	};

	return (
		<>
			<Card className="w-full max-w-xl mx-auto">
				<CardHeader className="text-lg font-semibold text-center ">Pay {amount}</CardHeader>

				<form id="payment-form" onSubmit={handleSubmit}>
					<CardContent className="flex flex-col gap-5">
						{/* Stripe Payment Elements */}
						<LinkAuthenticationElement />
						<PaymentElement options={paymentElementOptions} />

						{/* <AddressElement
							options={{
								mode: 'billing',
								fields: {
									phone: 'always',
								},
							}}
							onChange={e => setAddressObject(e)}
						/> */}
					</CardContent>

					<CardFooter className="flex flex-col gap-2">
						<Button className="w-full my-2" disabled={isLoading || !stripe || !elements} id="submit">
							<span id="button-text">{isLoading ? <div className="spinner" id="spinner"></div> : 'Pay now'}</span>
						</Button>
						{/* Show any error or success messages */}
						{message && (
							<div id="payment-message" className="animate-pulse hover:animate-none">
								{message}
							</div>
						)}
					</CardFooter>
				</form>
			</Card>
		</>
	);
}
