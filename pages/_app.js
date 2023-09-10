import MainWrapper from '@/components/views/MainWrapper';
// import ClerkWrapper from '@/lib/ClerkWrapper';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
	return (
		<>
			{/* <ClerkWrapper> */}
			<MainWrapper>
				<Component {...pageProps} />
			</MainWrapper>
			{/* </ClerkWrapper> */}
		</>
	);
}
