import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
*Blocks output for errors for tests which expect error to avoid confusing/noisy output
*/
export function blockErrorOutput() {
	// react also write via stdErr - mask this too.
	const stderrMock = vitest.spyOn(process.stderr, 'write').mockImplementation(() => true);
	const consoleErrorMock = vitest.spyOn(console, 'error').mockImplementation(() => null);
	return {
		restore: () => {
			stderrMock.mockRestore();
			consoleErrorMock.mockRestore();
		},
		stderrMock,
		consoleErrorMock,
	};
}

/**
*Blocks output for warnings for tests which expect warning to avoid confusing/noisy logging
*/
export function blockWarningOutput() {
	return vitest.spyOn(console, 'warn').mockImplementation(() => null);
}


export const wrapper = ({ children }: {
	children: React.ReactNode,
}) => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});

	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
};