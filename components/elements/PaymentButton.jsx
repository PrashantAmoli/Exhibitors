import { supabase } from '@/utils/supabase';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import StripePayment from '../forms/StripePayment';

export const PaymentButton = ({ slot, exhibition_id, slot_id }) => {
	const [slotData, setSlotData] = useState(null);
	const [paymentIntent, setPaymentIntent] = useState(false);
	const [order, setOrder] = useState(null);

	useEffect(() => {
		const getSlotData = async () => {
			const { data: slotData, error: slotDataError } = await supabase
				.from('slots')
				// .select('direct_booking, booked, id, exhibition_id, slot')
				.select('*')
				.match({ id: slot_id, exhibition_id: exhibition_id, slot: slot })
				.single();
			if (slotDataError) {
				console.error(slotDataError);
				return;
			} else setSlotData(slotData);
		};

		getSlotData();
	}, []);

	useEffect(() => {
		const getOrder = async () => {
			console.log(`Fetching order for slot ${slotData.id} and exhibition ${slotData.exhibition_id} and type reservation`);
			const { data: order, error: orderError } = await supabase
				.from('orders')
				.select('*')
				.match({ slot_id: slotData.id, exhibition_id: slotData.exhibition_id, type: 'reservation' })
				.single();
			if (orderError) {
				console.error(orderError);
				return;
			} else setOrder(order);
		};
		if (slotData && !slotData.booked && slotData.direct_booking) {
			getOrder();
		}
	}, [slotData]);

	return (
		<>
			<p className="break-words">{JSON.stringify(slotData)}</p>

			{!slotData?.booked && slotData?.direct_booking ? (
				<Button onClick={() => setPaymentIntent(!paymentIntent)}>Pay now</Button>
			) : (
				<p className="p-2 w-fit">No updates yet, well notify you when the time comes</p>
			)}

			<p className="p-2 m-2 break-words border rounded">{JSON.stringify(order)}</p>

			{paymentIntent && order ? <StripePayment order={order} /> : null}
		</>
	);
};

export default PaymentButton;
