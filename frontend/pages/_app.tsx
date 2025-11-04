import { PonderProvider } from '@ponder/react';
import { getDefaultConfig, lightTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { Roboto_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { sepolia } from 'viem/chains';
import { WagmiProvider } from 'wagmi';
import { ClientRainbowKitProvider } from '../src/components/ClientRainbowKitProvider';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { ponderClient } from '../src/lib/ponderClient';
import { createQueryClient } from '../src/lib/queryClient';
import '../styles/globals.css';

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-roboto-mono',
});

// Export the font className so it can be used in portaled components
export { robotoMono };

const wagmiConfig = getDefaultConfig({
  appName: 'Aminals',
  projectId: 'a8bd6a09bfba4f70a0b02ee66e844702',
  chains: [sepolia],
});

const rainbowTheme = lightTheme({
  accentColor: '#000',
  fontStack: 'system',
});

const queryClient = createQueryClient();

function AminalsApp({ Component, pageProps }: AppProps) {
  return (
    <div className={robotoMono.className}>
      <ErrorBoundary>
        <WagmiProvider config={wagmiConfig}>
          <PonderProvider client={ponderClient}>
            <QueryClientProvider client={queryClient}>
              <ClientRainbowKitProvider theme={rainbowTheme}>
                <Component {...pageProps} />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#ffffff',
                      color: '#000000',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '16px',
                      boxShadow:
                        '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                      fontWeight: '500',
                      cursor: 'pointer',
                    },
                    success: {
                      iconTheme: {
                        primary: '#10b981',
                        secondary: '#ffffff',
                      },
                    },
                    error: {
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#ffffff',
                      },
                    },
                  }}
                />
              </ClientRainbowKitProvider>
            </QueryClientProvider>
          </PonderProvider>
        </WagmiProvider>
      </ErrorBoundary>
    </div>
  );
}

export default AminalsApp;
