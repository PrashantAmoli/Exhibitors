import Image from 'next/image';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import StripePayment from '@/components/forms/StripePayment';
import { SignedIn } from '@clerk/nextjs';
import Inquiries from '@/components/elements/Inquirires';
import { TransactionsTable } from '@/components/tables/TransactionsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bookings } from '@/components/elements/Bookings';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	return (
		<>
			<Head>
				<title>EaseMyExpo: Exhibitor</title>
			</Head>

			<main className="w-full p-2">
				<div className="w-full">
					<SignedIn>
						<Tabs defaultValue="transactions">
							<TabsList className="w-full border">
								<TabsTrigger value="transactions" className="w-full capitalize">
									transactions
								</TabsTrigger>
								<TabsTrigger value="inquiries" className="w-full capitalize">
									inquiries
								</TabsTrigger>
								<TabsTrigger value="bookings" className="w-full capitalize">
									bookings
								</TabsTrigger>
							</TabsList>

							<TabsContent value="transactions" className="w-full">
								<TransactionsTable />
							</TabsContent>

							<TabsContent value="inquiries" className="w-full">
								<Inquiries />
							</TabsContent>

							<TabsContent value="bookings" className="w-full">
								<Bookings />
							</TabsContent>
						</Tabs>
					</SignedIn>
				</div>
			</main>
		</>
	);
}
