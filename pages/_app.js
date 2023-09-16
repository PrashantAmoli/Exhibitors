import MainWrapper from '@/components/views/MainWrapper';
import { queryClient } from '@/lib/ReactQuery';
// import ClerkWrapper from '@/lib/ClerkWrapper';
import '@/styles/globals.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

export default function App({ Component, pageProps }) {
	return (
		<>
			<ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
				<QueryClientProvider client={queryClient}>
					<MainWrapper>
						<Component {...pageProps} />
					</MainWrapper>
				</QueryClientProvider>

				<Toaster position="bottom-center" closeButton />
			</ThemeProvider>
		</>
	);
}
