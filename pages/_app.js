import MainWrapper from '@/components/views/MainWrapper';
import { queryClient } from '@/lib/ReactQuery';
// import ClerkWrapper from '@/lib/ClerkWrapper';
import '@/styles/globals.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

export default function App({ Component, pageProps }) {
	return (
		<>
			<QueryClientProvider client={queryClient}>
				{/* <ClerkWrapper> */}
				<MainWrapper>
					<Component {...pageProps} />
				</MainWrapper>
				{/* </ClerkWrapper> */}

				<Toaster position="bottom-center" closeButton />
			</QueryClientProvider>
		</>
	);
}
