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
	console.log('req', req);
	console.log('req.body', req?.body);
	console.log('payload', payload);

	if (payload && sig) console.log('payload and sig exist');

	let event;

	try {
		event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_AWK110XqmEZ8JrGZs0lDPIJhHnAZuNMc');
	} catch (err) {
		console.log(err);
		return res.status(400).send(`Webhook Error: ${err.message}`);
	}

	console.log('event', JSON.stringify(event, null, 2));

	const order = {};

	order.type = event.type;
	order.livemode = event.data.object.livemode;
	order.amount = event.data.object.amount_received;
	order.currency = event.data.object.currency;
	order.status = event.data.object.status;
	order.metadata = event.data.object.metadata;
	order.event_id = event.id;

	console.log('order', order);

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
