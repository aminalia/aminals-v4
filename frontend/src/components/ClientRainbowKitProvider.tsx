import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { ReactNode, useEffect, useState } from 'react';

interface ClientRainbowKitProviderProps {
  children: ReactNode;
  theme?: any;
}

/**
 * Wrapper for RainbowKitProvider that only renders on client-side
 * to avoid localStorage SSR issues during build
 */
export function ClientRainbowKitProvider({
  children,
  theme,
}: ClientRainbowKitProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <RainbowKitProvider theme={theme}>{children}</RainbowKitProvider>;
}
