import { supabase } from '@/utils/supabase';
import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import PaymentButton from './PaymentButton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JSONData } from '@/components/elements/JSONData';

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
				<div className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 xl:grid-cols-3">
					{inquiries.map(inquiry => (
						<InquiriesCard inquiry={inquiry} key={inquiry.id} />
					))}
				</div>
			</section>
		</>
	);
};

export const InquiriesCard = ({ inquiry }) => {
	return (
		<>
			<Card className="w-full">
				<CardHeader>
					<CardTitle>
						Slot {inquiry?.slot} of exhibition {inquiry.exhibition_id}
					</CardTitle>
					<CardDescription>Card Description</CardDescription>
				</CardHeader>
				<CardContent className="">
					<ul className="w-full">
						<li className="w-full">{inquiry?.email}</li>
						<li className="w-full">
							{inquiry?.first_name} {inquiry?.last_name}
						</li>
						<li className="w-full">{inquiry?.phone_no}</li>
						<li className="w-full">{inquiry?.company}</li>
					</ul>

					<JSONData trigger="Inquiry" json={inquiry} />
				</CardContent>
				<CardFooter className="flex flex-col gap-1">
					<Badge variant="">{inquiry?.status}</Badge>
					<PaymentButton slot={inquiry.slot} exhibition_id={inquiry.exhibition_id} slot_id={inquiry.slot_id} />
				</CardFooter>
			</Card>
		</>
	);
};

export default Inquiries;
