import { supabase } from '@/utils/supabase';

// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = async metadata => {
	const { order_id } = metadata;

	const { data: orderData, error } = await supabase.from('orders').select('*').eq('id', order_id).single();

	if (error) {
		console.error('error', error);
		return res.status(500).json({ error });
	}

	if (orderData.type !== metadata?.category) {
		console.error(`DB order type ${orderData.type} !== ${metadata?.type} from metadata`);
	}

	if (parseFloat(orderData?.amount) !== parseFloat(metadata?.amount)) {
		console.error(`DB order amount ${parseFloat(orderData?.amount)} !== ${parseFloat(metadata?.amount)} from metadata`);
	}

	return parseFloat(orderData?.amount);
};

export default async function handler(req, res) {
	const { metadata } = req.body;
	// * DON'T ADD console.log() STATEMENTS HERE
	// * This endpoint is triggered a lot and it will fill up logs

	const amount = await calculateOrderAmount(metadata);
	console.log('amount', amount);

	// Create a PaymentIntent with the order amount and currency
	const paymentIntent = await stripe.paymentIntents.create({
		// payment_method_types: ['card'],
		amount: amount * 100,
		currency: 'inr',
		// In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
		automatic_payment_methods: {
			enabled: true,
		},
		metadata: req?.body?.metadata || {},
	});

	res.send({
		clientSecret: paymentIntent.client_secret,
	});
}
