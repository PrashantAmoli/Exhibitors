import Head from 'next/head';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
	return (
		<>
			<Head>
				<title>Sign In</title>
			</Head>

			<main className="fixed flex items-center justify-center w-full min-h-screen p-2">
				<SignIn
					appearance={{
						elements: {},
					}}
				/>
			</main>
		</>
	);
}
