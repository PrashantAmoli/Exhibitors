import { stripe } from '@/utils/stripe';
import { supabase } from '@/utils/supabase';
import { buffer } from 'micro';

export const config = {
	api: {
		bodyParser: false,
	},
};

const updateSlotUsingOrder = async order => {
	const { data: slotData, error: slotUpdateError } = await supabase
		.from('slots')
		.update({
			status: 'booked',
			booked: true,
			booked_by: order?.paid_by,
		})
		.eq('id', order?.slot_id);

	if (slotUpdateError) {
		console.error('slotUpdateError', slotUpdateError);
		return;
	}
};

const updateOrderUsingTransaction = async transaction => {
	const { data: orderData, error: orderUpdateError } = await supabase
		.from('orders')
		.update({
			status: 'paid',
			transaction_id: transaction?.id,
			paid_by: transaction?.user_id,
			updated_at: new Date().toISOString(),
		})
		.eq('id', transaction?.order_id)
		.select();

	if (orderUpdateError) {
		console.error('orderUpdateError', orderUpdateError);
		return;
	}

	await updateSlotUsingOrder(orderData[0]);
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

	const transaction = {};

	transaction.event = event.type;
	transaction.livemode = event.data.object.livemode;
	transaction.amount = event.data.object.amount_received;
	transaction.currency = event.data.object.currency;
	transaction.event_id = event.id;

	const metadata = event.data.object.metadata;

	transaction.first_name = metadata.first_name;
	transaction.last_name = metadata.last_name;
	transaction.email = metadata.email;
	transaction.user_id = metadata?.user_id;
	// TODO: Add order_id to metadata when orders are implemented
	transaction.order_id = metadata?.order_id;
	transaction.type = metadata?.type || 'unknown';
	transaction.json = event;

	let paymentIntent;
	// Handle the event
	switch (event.type) {
		case 'payment_intent.succeeded':
			transaction.status = 'succeeded';
			console.log('PaymentIntent was successful!');
			break;
		case 'payment_intent.payment_failed':
			transaction.status = 'failed';
			console.log('PaymentIntent failed!');
			break;
		case 'payment_intent.cancelled':
			transaction.status = 'cancelled';
			console.log('PaymentIntent was cancelled!');
			break;
		default:
			console.log(`Unhandled event type ${event.type}`);
	}

	console.log('transaction', transaction);
	const { data, error } = await supabase
		.from('transactions')
		.insert([{ ...transaction }])
		.select();

	if (error) {
		console.log('error', error);
		return res.status(500).json({ error });
	}

	if (event.type === 'payment_intent.succeeded') await updateOrderUsingTransaction(data[0]);

	res.status(200).json({ received: true, message: 'Successfully created transaction from Webhook' });
}
