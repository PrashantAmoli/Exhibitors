import { supabase } from '@/utils/supabase';
import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import PaymentButton from './PaymentButton';

export const Inquiries = () => {
	const { user } = useUser();
	const [inquiries, setInquiries] = useState([]);

	const getInquiries = async () => {
		const email = user.primaryEmailAddress.emailAddress;

		if (!email) return;

		const { data: inquiries, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false }).eq('email', email);
		if (error) console.log(error);
		else setInquiries(inquiries);
	};

	useEffect(() => {
		getInquiries();
	}, []);

	return (
		<>
			<section className="w-full mx-auto my-3 overflow-y-auto">
				<div className="grid grid-cols-1 p-2">
					{JSON.stringify(user.primaryEmailAddress.emailAddress)}
					{inquiries.map(inquiry => (
						<div className="p-2 m-2 border rounded" key={inquiry.id}>
							<p className="break-words">{JSON.stringify(inquiry)}</p>
							<PaymentButton slot={inquiry.slot} exhibition_id={inquiry.exhibition_id} slot_id={inquiry.slot_id} />
						</div>
					))}
				</div>
			</section>
		</>
	);
};

export default Inquiries;
