// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = order => {
	// Replace this constant with a calculation of the order's amount
	// Calculate the order total on the server to prevent
	// people from directly manipulating the amount on the client
	return parseInt(order.amount) * 100;
};

export default async function handler(req, res) {
	const { order } = req.body;
	// * DON'T ADD console.log() STATEMENTS HERE
	// * This endpoint is triggered a lot and it will fill up logs

	// Create a PaymentIntent with the order amount and currency
	const paymentIntent = await stripe.paymentIntents.create({
		// payment_method_types: ['card'],
		amount: calculateOrderAmount(order),
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
