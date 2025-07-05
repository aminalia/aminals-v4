// Direct fetch alternative for debugging
import { useQuery } from '@tanstack/react-query';

const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/57078/aminals-3/version/latest';

const AMINALS_QUERY = `
  query AminalsList($first: Int = 100, $skip: Int = 0, $address: Bytes = "") {
    aminals(first: $first, skip: $skip) {
      id
      contractAddress
      aminalIndex
      momAddress
      dadAddress
      energy
      totalLove
      blockTimestamp
      tokenURI
      backId
      armId
      tailId
      earsId
      bodyId
      faceId
      mouthId
      miscId
      lovers(where: { user_: { address: $address } }) {
        love
      }
    }
  }
`;

export type AminalFilter = 'all' | 'loved';
export type AminalSort = 'most-loved' | 'least-loved' | 'oldest' | 'youngest';

export const useAminalsDirect = (
  userAddress: string,
  filter: AminalFilter = 'all',
  sort: AminalSort = 'most-loved'
) => {
  return useQuery({
    queryKey: ['aminals-direct', filter, sort, userAddress], // Remove Date.now() to enable proper caching
    queryFn: async () => {
      const response = await fetch(SUBGRAPH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: AMINALS_QUERY,
          variables: { first: 100, skip: 0, address: userAddress }
        })
      });

      const data = await response.json();

      if (data.errors) {
        console.error('Aminals fetch errors:', data.errors);
        throw new Error(data.errors[0].message);
      }

      let aminals = data.data?.aminals || [];

      // Apply filter (simplified)
      if (filter === 'loved') {
        aminals = aminals.filter((aminal: any) => 
          aminal.lovers && aminal.lovers.length > 0 && Number(aminal.lovers[0].love) > 0
        );
      }

      // Apply sort
      if (sort === 'most-loved') {
        aminals.sort((a: any, b: any) => Number(b.totalLove) - Number(a.totalLove));
      } else if (sort === 'least-loved') {
        aminals.sort((a: any, b: any) => Number(a.totalLove) - Number(b.totalLove));
      } else if (sort === 'oldest') {
        aminals.sort((a: any, b: any) => Number(a.blockTimestamp) - Number(b.blockTimestamp));
      } else if (sort === 'youngest') {
        aminals.sort((a: any, b: any) => Number(b.blockTimestamp) - Number(a.blockTimestamp));
      }

      return aminals;
    },
  });
};