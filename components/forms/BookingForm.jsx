import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { supabase } from '@/utils/supabase';
import { useToast } from '../ui/use-toast';

export const BookingForm = ({ slot, exhibitionData, slotsData }) => {
	const [formData, setFormData] = useState({ slot: slot });
	const [required, setRequired] = useState(false);

	const { toast } = useToast();

	const handleSubmit = async e => {
		e.preventDefault();
		const form = e.target;
		const formData = new FormData(form);
		const payload = Object.fromEntries(formData);

		const slot_id = slotsData?.find(slotData => slotData.slot === `${slot}`)?.id;
		if (!slot_id) {
			console.log(`Slot ID could not be found for ${slot}`);
			toast({
				title: 'Error: Slot ID could not be found',
				description: 'Try refreshing the page. If the problem persists, please contact support.',
				variant: 'destructive',
			});
			return;
		}

		const exhibition_id = exhibitionData?.id;
		if (!exhibition_id) {
			console.log(exhibitionData);
			console.log(`Exhibition ID could not be found for exhibition: ${exhibitionData?.title}`);
			toast({
				title: 'Error: Exhibition ID could not be found',
				description: 'Try refreshing the page. If the problem persists, please contact support.',
				variant: 'destructive',
			});
			return;
		}

		const submission = {
			exhibition_id: exhibition_id,
			slot_id: slot_id,
			slot: slot,
			email: payload.email,
			first_name: payload.first_name,
			last_name: payload.last_name,
			// personal_email: payload.personal_email,
			phone_no: payload.phone,
			company: payload.company,
			// position: payload.position,
			// website: payload.website,
			// address: payload.address,
			// city: payload.city,
			// state: payload.state,
		};

		// TODO: Add validation for all form fields

		if (
			!submission?.email ||
			!submission?.first_name ||
			!submission?.last_name ||
			!submission?.phone_no ||
			!submission?.company ||
			!submission?.slot ||
			!submission?.slot_id ||
			!submission?.exhibition_id
		) {
			console.log('Missing required fields', submission);
			toast({
				title: 'Error: Missing required fields',
				description: 'Please fill out all required fields.',
				variant: 'destructive',
			});
			return;
		}

		const res = await supabase.from('inquiries').insert(submission);

		if (res.error) {
			toast({
				title: 'Error',
				description: res.error.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				variant: 'destructive',
			});
			console.log(res.error);
		} else {
			toast({
				title: 'Success',
				description: 'Your inquiry has been submitted successfully.',
				status: 'success',
				duration: 5000,
				isClosable: true,
				variant: 'solid',
			});
		}
	};

	return (
		<>
			<form
				className="flex flex-col w-full max-w-2xl gap-5 p-1 mx-auto my-5 overflow-y-auto border-blue-500 sm:p-4 rounded-2xl"
				onSubmit={e => handleSubmit(e)}
			>
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

					<div className="flex flex-col w-full gap-1">
						<Label className="capitalize" htmlFor="address">
							address
						</Label>
						<Input id="address" name="address" type="text" placeholder="Address" required={required} />
					</div>

					<div className="flex flex-col w-full gap-1">
						<Label className="capitalize" htmlFor="city">
							city
						</Label>
						<Input id="city" name="city" type="text" placeholder="City" required={required} />
					</div>

					<div className="flex flex-col w-full gap-1">
						<Label className="capitalize" htmlFor="state">
							state
						</Label>
						<Input id="state" name="state" type="text" placeholder="State" required={required} />
					</div>
				</div>

				<div className="flex flex-row-reverse gap-2">
					<Button className="" type="submit">
						Submit
					</Button>

					<Button className="" variant="outline">
						Cancel
					</Button>
				</div>
			</form>
		</>
	);
};

export default BookingForm;
