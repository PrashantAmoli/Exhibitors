import { stripe } from '@/utils/stripe';
import { buffer } from 'micro';

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async function handler(req, res) {
	const sig = req.headers['stripe-signature'];
	const payload = (await buffer(req)).toString();

	if (payload && sig) console.log('payload and sig exist');

	let event;

	try {
		event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_AWK110XqmEZ8JrGZs0lDPIJhHnAZuNMc');
	} catch (err) {
		console.log(err);
		return res.status(400).send(`Webhook Error: ${err.message}`);
	}

	let paymentIntent;
	// Handle the event
	switch (event.type) {
		case 'payment_intent.succeeded':
			paymentIntent = event.data.object;
			console.log('PaymentIntent was successful!');
			break;
		case 'payment_intent.payment_failed':
			paymentIntent = event.data.object;
			console.log('PaymentIntent failed!');
			break;
		case 'payment_intent.cancelled':
			paymentIntent = event.data.object;
			console.log('PaymentIntent was cancelled!');
			break;
		default:
			console.log(`Unhandled event type ${event.type}`);
	}

	res.status(200).json({ received: true, event });
}
