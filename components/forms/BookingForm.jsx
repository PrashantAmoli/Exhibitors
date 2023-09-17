import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/utils/supabase';
import { toast } from 'sonner';
import { SignIn, SignUp, useAuth } from '@clerk/nextjs';
import { JSONData } from '../elements/JSONData';
import Link from 'next/link';

export const BookingForm = ({ slot, exhibitionData, slotsData }) => {
	const authData = useAuth();

	const [formData, setFormData] = useState({
		slot: slot,
		first_name: '',
		last_name: '',
		personal_email: '',
		phone_no: '',
		company: '',
		position: '',
		website: '',
		address: '',
		city: '',
		state: '',
	});
	const [required, setRequired] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const easemyexpo_booking_data = JSON.parse(localStorage.getItem('easemyexpo_booking_data'));
			if (easemyexpo_booking_data) {
				setFormData({ slot, ...easemyexpo_booking_data });
			}
			console.log(easemyexpo_booking_data);
		}
	}, [slot]);

	const handleSubmit = async e => {
		e.preventDefault();
		const form = e.target;
		const formData = new FormData(form);
		const payload = Object.fromEntries(formData);

		const slot_id = slotsData?.find(slotData => slotData.slot === `${slot}`)?.id;
		if (!slot_id) {
			console.log(`Slot ID could not be found for ${slot}`);
			toast.error(`Technical Error`, {
				description: `Slot ID could not be found for ${JSON.stringify(
					slot
				)}. Try refreshing the page. If the problem persists, please contact support.`,
			});
			return;
		}

		const exhibition_id = exhibitionData?.id;
		if (!exhibition_id) {
			console.log(exhibitionData);
			console.log(`Exhibition ID could not be found for exhibition: ${exhibitionData?.title}`);
			toast.error(`Technical Error`, {
				description: `Exhibition ID could not be found for exhibition ${exhibitionData?.title}. Try refreshing the page. If the problem persists, please contact support.`,
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
			toast.error(`Missing required fields`, {
				description: `Please fill all the required fields.`,
			});
			return;
		}

		// TODO: Save details in local storage
		localStorage.setItem(
			'easemyexpo_booking_data',
			JSON.stringify({
				email: submission.email,
				first_name: submission.first_name,
				last_name: submission.last_name,
				phone_no: submission.phone_no,
				company: submission.company,
				personal_email: submission.personal_email,
				position: submission.position,
				website: submission.website,
				address: submission.address,
				city: submission.city,
				state: submission.state,
			})
		);

		const existingInquiry = await supabase
			.from('inquiries')
			.select('id')
			.match({ email: submission.email, slot: submission.slot, slot_id: submission.slot_id, exhibition_id: submission.exhibition_id });

		if (existingInquiry.error) {
			console.log(existingInquiryError);
			toast.error(`Technical Error`, {
				description: `An error occurred while checking for existing inquiries. Please try again. If the problem persists, please contact support.`,
			});
			return;
		}

		console.log(existingInquiry);

		if (existingInquiry.data.length > 0) {
			const res = await supabase
				.from('inquiries')
				.update(submission)
				.match({ email: submission.email, slot: submission.slot, slot_id: submission.slot_id, exhibition_id: submission.exhibition_id });

			if (res.error) {
				toast.error(`Error`, {
					description: `${res.error.message}`,
				});
				console.log(res.error);
			} else {
				toast.success(`Submission Successful`, {
					description: `Your inquiry has been submitted successfully.
						Please check your email for further instructions or head over to easemyexpo.com.`,
				});
				setSubmitted(true);
			}
		} else {
			const res = await supabase.from('inquiries').insert(submission);
			if (res.error) {
				toast.error(`Error`, {
					description: `${res.error.message}`,
				});
				console.log(res.error);
			} else {
				toast.success(`Submission Successful`, {
					description: `Your inquiry has been submitted successfully.
						Please check your email for further instructions or head over to easemyexpo.com.`,
				});
				setSubmitted(true);
			}
		}
	};

	useEffect(() => {
		if (typeof window !== 'undefined' && submitted) {
			setTimeout(() => {
				// redirect to /auth/sign-in in a new tab
				window.open('/auth/sign-in', '_blank');
			}, 5000);
		}
	}, [submitted]);

	if (submitted)
		return (
			<>
				{authData?.isSignedIn ? (
					<Link href="/" target="_blank" className="flex items-center justify-center w-full mx-auto">
						<Button variant="outline" className="mx-auto animate-pulse" size="lg">
							Continue on EaseMyExpo
						</Button>
					</Link>
				) : (
					<>
						<section className="mx-auto w-fit">
							<SignIn className="" />
						</section>
					</>
				)}
				<JSONData trigger="Auth" json={authData} />
			</>
		);

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
						<Input id="first_name" name="first_name" type="text" placeholder="John" value={slot} required={required} readOnly={slot ? true : false} />
					</div>

					<div className="flex flex-col w-full gap-1">
						<Label className="capitalize" htmlFor="email">
							Email
						</Label>
						<Input id="email" name="email" type="email" placeholder="team@company.com" required={required} defaultValue={formData?.email} />
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
						<Input id="phone" name="phone" type="tel" placeholder="123-456-7890" defaultValue={formData?.phone_no || ''} required={required} />
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
						<Input id="company" name="company" type="text" placeholder="Company Name" defaultValue={formData?.company || ''} required={required} />
					</div>

					<div className="flex flex-col w-full gap-1">
						<Label className="capitalize" htmlFor="website">
							website
						</Label>
						<Input
							id="website"
							name="website"
							type="url"
							defaultValue={formData?.website || ''}
							placeholder="https://company.com"
							required={required}
						/>
					</div>

					<div className="flex flex-col w-full gap-1">
						<Label className="capitalize" htmlFor="address">
							address
						</Label>
						<Input id="address" name="address" type="text" placeholder="Address" defaultValue={formData?.address || ''} required={required} />
					</div>

					<div className="flex flex-col w-full gap-1">
						<Label className="capitalize" htmlFor="city">
							city
						</Label>
						<Input id="city" name="city" type="text" placeholder="City" defaultValue={formData?.city || ''} required={required} />
					</div>

					<div className="flex flex-col w-full gap-1">
						<Label className="capitalize" htmlFor="state">
							state
						</Label>
						<Input id="state" name="state" type="text" placeholder="State" defaultValue={formData?.state || ''} required={required} />
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
