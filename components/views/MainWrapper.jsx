import Link from 'next/link';

export const Navbar = ({ children }) => {
	return (
		<>
			<nav className="w-full h-10 p-1 shadow-xl sm:px-5 hover:shadow-2xl">
				<Link href="/">
					<h3 className="text-xl uppercase font-SpaceX">Exhibitors</h3>
				</Link>

				<div className="w-fit">{children}</div>
			</nav>
		</>
	);
};

export const Footer = ({ children }) => {
	return (
		<>
			<footer className="w-full px-2 py-3 text-sm text-center text-muted-foreground">
				<div className="w-full">{children}</div>
				Copyright &copy; 2023 EaseMyExpo | All Rights Reserved | Terms & Conditions | Privacy Policy | Contact Us | About Us
			</footer>
		</>
	);
};

export const MainWrapper = ({ children, navbar, footer }) => {
	return (
		<>
			<Navbar>{navbar}</Navbar>
			{children}
			<Footer>{footer}</Footer>
		</>
	);
};

export default MainWrapper;
