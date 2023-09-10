import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PaymentElement, AddressElement, LinkAuthenticationElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const STRIPE_PAYMENT_INTENT_API = '/api/v1/payments/stripe/intent';

export default function StripePayment() {
	const [clientSecret, setClientSecret] = useState('');

	useEffect(() => {
		// Create PaymentIntent as soon as the page loads
		fetch(STRIPE_PAYMENT_INTENT_API, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				items: [{ id: 'xl-tshirt' }],
				metadata: {
					slot: '1',
					email: 'abc@gmail.com',
					phone: '1234567890',
					name: 'abc',
				},
			}),
		})
			.then(res => res.json())
			.then(data => setClientSecret(data.clientSecret));
	}, []);

	const appearance = {
		theme: 'stripe',
	};
	const options = {
		clientSecret,
		appearance,
	};

	return (
		<section className="w-full max-w-lg mx-auto my-3 overflow-y-auto">
			{clientSecret && (
				<Elements options={options} stripe={stripePromise}>
					<StripePaymentForm />
				</Elements>
			)}
		</section>
	);
}

export function StripePaymentForm({ slot = 21 }) {
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

			if (!addressObject?.complete) {
				alert('Please fill in your address');
				return;
			}

			const address = addressObject.value;

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
	};

	return (
		<>
			<Card className="w-full max-w-xl mx-auto">
				<CardHeader>Payment</CardHeader>

				<form id="payment-form" onSubmit={handleSubmit}>
					<CardContent className="flex flex-col gap-5">
						<div className="flex flex-col gap-3 p-3 border rounded-2xl">
							<div className="flex flex-col w-full gap-1">
								<Label className="capitalize" htmlFor="first_name">
									Slot
								</Label>
								<Input id="first_name" name="first_name" type="text" placeholder="John" value={slot} required={required} />
							</div>

							<div className="flex flex-col w-full gap-1">
								<Label className="capitalize" htmlFor="email">
									Email
								</Label>
								<Input id="email" name="email" type="email" placeholder="team@company.com" required={required} />
								<p className="text-xs text-muted-foreground">
									NOTE: This email address will be used for all further processes and communication including email updates, payments, client portal
									login(coming soon), etc. Please make sure this is the correct email address & use it for all future communication.
								</p>
							</div>
						</div>

						<div className="flex flex-col gap-3 p-3 border rounded-2xl">
							<div className="flex flex-col w-full gap-1">
								<Label className="capitalize" htmlFor="first_name">
									First Name
								</Label>
								<Input
									id="first_name"
									name="first_name"
									type="text"
									placeholder="John"
									defaultValue={formData?.first_name || ''}
									onChange={e => setFormData({ ...formData, first_name: e.target.value })}
								/>
							</div>

							<div className="flex flex-col w-full gap-1">
								<Label className="capitalize" htmlFor="last_name">
									Last Name
								</Label>
								<Input
									id="last_name"
									name="last_name"
									type="text"
									placeholder="Doe"
									defaultValue={formData?.last_name || ''}
									onChange={e => setFormData({ ...formData, last_name: e.target.value })}
								/>
							</div>

							<div className="flex flex-col w-full gap-1">
								<Label className="capitalize" htmlFor="personal_email">
									Personal Email
								</Label>
								<Input
									id="personal_email"
									name="personal_email"
									type="email"
									placeholder={formData?.first_name ? `${formData?.first_name}@gmail.com` : 'Your email'}
									defaultValue={formData?.personal_email || ''}
									onChange={e => setFormData({ ...formData, personal_email: e.target.value })}
								/>
							</div>

							<div className="flex flex-col w-full gap-1">
								<Label className="capitalize" htmlFor="phone">
									Phone no.
								</Label>
								<Input id="phone" name="phone" type="tel" placeholder="123-456-7890" required={required} />
							</div>

							<div className="flex flex-col w-full gap-1">
								<Label className="capitalize" htmlFor="position">
									Position
								</Label>
								<Input
									id="position"
									name="position"
									type="text"
									placeholder="Position i.e. CEO, CMO, etc."
									defaultValue={formData?.position || ''}
									onChange={e => setFormData({ ...formData, position: e.target.value })}
								/>
							</div>
						</div>

						<div className="flex flex-col gap-3 p-3 border rounded-2xl">
							<div className="flex flex-col w-full gap-1">
								<Label className="capitalize" htmlFor="company">
									Company
								</Label>
								<Input id="company" name="company" type="text" placeholder="Company Name" required={required} />
							</div>

							<div className="flex flex-col w-full gap-1">
								<Label className="capitalize" htmlFor="website">
									website
								</Label>
								<Input id="website" name="website" type="url" placeholder="https://company.com" required={required} />
							</div>
						</div>

						{/* Stripe Payment Elements */}
						<LinkAuthenticationElement
							id="link-authentication-element"
							onChange={e => {
								console.log(e.value);
								setEmail(e.value.email);
							}}
						/>
						<PaymentElement id="payment-element" options={paymentElementOptions} />

						<AddressElement
							options={{
								mode: 'billing',
								fields: {
									phone: 'always',
								},
							}}
							onChange={e => setAddressObject(e)}
						/>
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
