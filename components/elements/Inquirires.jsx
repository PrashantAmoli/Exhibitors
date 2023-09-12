import { supabase } from '@/utils/supabase';
import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import PaymentButton from './PaymentButton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '../ui/badge';

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
							<Card>
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
								</CardContent>
								<CardFooter className="flex flex-col">
									<Badge variant="">{inquiry?.status}</Badge>
									<PaymentButton slot={inquiry.slot} exhibition_id={inquiry.exhibition_id} slot_id={inquiry.slot_id} />
								</CardFooter>
							</Card>

							<p className="break-words">{JSON.stringify(inquiry)}</p>
						</div>
					))}
				</div>
			</section>
		</>
	);
};

export default Inquiries;
