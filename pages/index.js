import Image from 'next/image';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import StripePayment from '@/components/forms/StripePayment';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
	return (
		<>
			<Head>
				<title>EaseMyExpo: Exhibitor</title>
			</Head>

			<main className="w-full p-2">
				<h1 className="text-center">Exhibitors Portal</h1>

				<div className="w-full">
					<StripePayment />
				</div>
			</main>
		</>
	);
}
