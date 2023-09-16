import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { CreateOrganization, OrganizationProfile, OrganizationSwitcher } from '@clerk/clerk-react';
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
// import DropdownMenuWrapper from '../DropdownMenuWrapper';

const publicPages = ['/', '/sign-in/[[...index]]', '/sign-up/[[...index]]', '/admin', '/admin/orders', '/admin/users', '/embed', '/demo', '/tests'];

const Navbar = ({ children }) => {
	const { theme, setTheme } = useTheme();
	const userData = useUser();

	const router = useRouter();
	const { pathname } = router;

	if (pathname === '/demo' || pathname.includes('demo') || pathname.includes('embed') || pathname.includes('tests')) return <>{children}</>;

	return (
		<>
			<nav className="relative inset-x-0 top-0 z-30 items-center justify-center hidden w-full shadow-xl dark:shadow-xl dark:shadow-blue-300/10 sm:flex backdrop-blur">
				<div className="flex flex-row items-center justify-between w-full gap-1 px-2 mx-auto sm:gap-3 max-w-7xl h-14 ">
					<Link href="/">
						<h2 className="text-xl text-center uppercase lg:text-2xl font-SpaceX">Exhibitors</h2>
					</Link>

					{/* <DropdownMenuWrapper /> */}

					<div className="flex gap-1">
						<SignedIn>
							{/* <OrganizationSwitcher
								appearance={{
									elements: {
										organizationSwitcherPopoverActionButton: userData?.user?.publicMetadata?.role === 'superadmin' ? '' : 'disabled hidden ',
										organizationPreview: 'text-black dark:text-white',
										organizationSwitcherTriggerIcon: 'text-black dark:text-white',
									},
								}}
							/> */}
							<UserButton />
						</SignedIn>

						<SignedOut>
							<SignInButton>
								<Button>Sign In</Button>
							</SignInButton>
						</SignedOut>

						<Switch
							checked={theme === 'dark' ? true : false}
							onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
							className="mt-1.5 transition-all duration-500 ease-in-out rotate-90"
						/>
					</div>
				</div>
			</nav>

			{children}

			{/* footer */}
			{/* <footer className="fixed bottom-0 flex flex-col items-center justify-center w-full h-12 py-3 mt-10 text-sm -z-10">
				2023 © EaseMyExpo | All Rights Reserved
			</footer> */}
			{/* <p className="break-words">{JSON.stringify(userData?.user?.publicMetadata?.role)}</p> */}
		</>
	);
};

export default function MainWrapper({ children }) {
	const { pathname } = useRouter();

	const isPublicPage = publicPages.includes(pathname);

	return (
		<ClerkProvider>
			<Navbar>
				{isPublicPage ? (
					<>{children}</>
				) : (
					<>
						<SignedIn>
							<div className="relative w-full">{children}</div>
						</SignedIn>

						<SignedOut>
							<div className="relative">{children}</div>
						</SignedOut>
					</>
				)}
			</Navbar>
		</ClerkProvider>
	);
}
