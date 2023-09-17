import { supabase } from '@/utils/supabase';
import { useAuth } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JSONData } from '@/components/elements/JSONData';

export const Bookings = () => {
	const { userId } = useAuth();
	const {
		isLoading,
		data: bookings,
		isError,
	} = useQuery({
		queryKey: ['bookings'],
		queryFn: async () => {
			const { data: bookings, error } = await supabase
				.from('slots')
				.select(
					`
        *, 
        exhibitions (*)
        `
				)
				.eq('booked_by', userId);
			if (error) console.log(error);
			else return bookings || [];
		},
	});

	return (
		<>
			<div className="flex">
				<h1 className="text-xl uppercase font-SpaceX">Bookings</h1>
				<JSONData trigger="Bookings" json={bookings} />
			</div>

			<section className="grid w-full grid-cols-1 gap-4 p-1 mx-auto my-3 max-w-7xl sm:grid-cols-2 xl:grid-cols-3">
				{bookings?.map(booking => (
					<BookingsCard booking={booking} key={booking.id} />
				))}
			</section>
		</>
	);
};

const BookingsCard = ({ booking }) => {
	return (
		<>
			<Card className="w-full">
				<CardHeader>
					<CardTitle>
						Slot {booking?.slot} of exhibition {booking.exhibitions.title}
					</CardTitle>
					<CardDescription>{booking?.exhibitions?.description}</CardDescription>
				</CardHeader>

				<CardContent>
					<JSONData json={booking} />
				</CardContent>

				<CardFooter className="flex ">
					<Badge variant={booking?.status === 'booked' ? 'success' : 'destructive'}>{booking?.status}</Badge>
				</CardFooter>
			</Card>
		</>
	);
};
