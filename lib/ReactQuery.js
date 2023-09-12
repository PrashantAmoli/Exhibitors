import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 3,
			retryDelay: 1000,
			staleTime: 1000 * 60 * 60 * 1, // 1 hours
			cacheTime: 1000 * 60 * 60 * 2, // 2 hours
		},
	},
});
