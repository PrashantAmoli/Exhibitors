import MainWrapper from '@/components/views/MainWrapper';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
	return (
		<>
			<MainWrapper>
				<Component {...pageProps} />
			</MainWrapper>
		</>
	);
}
