import AminalGrid from '@/components/aminal-grid';
import { useAminals } from '@/resources/aminals';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useAccount } from 'wagmi';
import Layout from './_layout';

const HomePage: NextPage = () => {
  const { address } = useAccount();
  const { data: aminals, isLoading: isLoadingAminals } = useAminals(
    address as string
  );

  return (
    <>
      <Head>
        <title>Aminals</title>
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Your Aminals</h1>
              {address && (
                <div className="text-sm text-gray-500">
                  {aminals?.length || 0} Aminals found
                </div>
              )}
            </div>

            {!address ? (
              <div className="flex items-center justify-center h-[50vh] text-gray-500">
                Connect your wallet to view your Aminals
              </div>
            ) : isLoadingAminals ? (
              <div className="flex items-center justify-center h-[50vh]">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <div className="text-gray-500">Loading your Aminals...</div>
                </div>
              </div>
            ) : aminals?.length === 0 ? (
              <div className="flex items-center justify-center h-[50vh] text-gray-500">
                No Aminals found
              </div>
            ) : (
              <AminalGrid aminals={aminals} />
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default HomePage;
