import Head from 'next/head';
import { SignUp } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignUpPage() {
	const [password, setPassword] = useState('');

	return (
		<>
			<Head>
				<title>Sign Up</title>
			</Head>

			<main className="fixed flex items-center justify-center w-full min-h-screen p-2">
				{password === 'password' ? (
					<SignUp />
				) : (
					<div className="flex flex-col items-center justify-center w-full max-w-md p-4 space-y-4 bg-white border border-gray-200 rounded-md shadow-md">
						<Label htmlFor="password">Password</Label>
						<Input type="password" placeholder="Enter 'password'" value={password} onChange={e => setPassword(e.target.value)} />
					</div>
				)}
			</main>
		</>
	);
}
