import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { ClerkProvider } from '@clerk/nextjs';
import { useRouter } from 'next/router';

const publicPages = ['/', '/sign-in/[[...index]]', '/sign-up/[[...index]]', '/admin', '/admin/orders', '/admin/users', '/embed', '/demo', '/tests'];

export const ClerkWrapper = ({ children }) => {
	const router = useRouter();
	const { pathname } = router;

	const isPublicPage = publicPages.includes(pathname);

	return (
		<>
			<ClerkProvider>
				{isPublicPage ? (
					<>
						{children}

						<span className="fixed bottom-0 right-1/3">Public</span>
					</>
				) : (
					<>
						<SignedIn>
							<>
								{children}

								<span className="fixed bottom-0 right-1/3">SignedIn</span>
							</>
						</SignedIn>

						<SignedOut>
							<>
								{children}

								<span className="fixed bottom-0 right-1/3">SignedOut</span>
							</>
						</SignedOut>
					</>
				)}
			</ClerkProvider>
		</>
	);
};

export default ClerkWrapper;
