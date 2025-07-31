import { AminalVisualImage } from '@/components/aminal-card';
import { Button } from '@/components/ui/button';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import Layout from '../../../_layout';
import { Plus, MessageCircle, ArrowLeft, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { ChatSession } from '../../../../lib/chat-storage';

// Reuse the same query as the Aminal detail page
const useAminalByAddress = (contractAddress: string, userAddress: string) => {
  return useQuery({
    queryKey: ['aminal-by-address', contractAddress, userAddress],
    queryFn: async () => {
      if (!contractAddress || contractAddress === 'undefined') {
        return null;
      }

      const SUBGRAPH_URL =
        'https://api.studio.thegraph.com/query/57078/aminals-3/version/latest';

      const query = `
        query AminalByAddress($contractAddress: Bytes, $address: Bytes) {
          aminals(where: { contractAddress: $contractAddress }) {
            id
            contractAddress
            aminalIndex
            energy
            totalLove
            tokenURI
            lovers(where: { user_: { address: $address } }) {
              love
            }
          }
        }
      `;

      const response = await fetch(SUBGRAPH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { contractAddress, address: userAddress },
        }),
      });

      const data = await response.json();

      if (data.errors) {
        console.error('Aminal fetch errors:', data.errors);
        throw new Error(data.errors[0].message);
      }

      const aminals = data.data?.aminals || [];
      return aminals.length > 0 ? aminals[0] : null;
    },
    enabled: !!contractAddress && contractAddress !== 'undefined',
  });
};

const useChatSessions = (aminalAddress: string, userAddress: string) => {
  return useQuery({
    queryKey: ['chat-sessions', aminalAddress, userAddress],
    queryFn: async () => {
      if (!aminalAddress || !userAddress) return [];

      const response = await fetch(`/api/chat/sessions?aminalAddress=${aminalAddress}&userAddress=${userAddress}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chat sessions');
      }
      return response.json();
    },
    enabled: !!aminalAddress && !!userAddress,
  });
};

const ChatSessionsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const contractAddress = id as string;
  const { address } = useAccount();
  const [isCreating, setIsCreating] = useState(false);

  const isRouterReady =
    router.isReady && id && typeof id === 'string' && id !== 'undefined';

  const {
    data: aminal,
    isLoading: isAminalLoading,
  } = useAminalByAddress(isRouterReady ? contractAddress : '', address || '');

  const {
    data: sessions,
    isLoading: isSessionsLoading,
    refetch: refetchSessions,
  } = useChatSessions(isRouterReady ? contractAddress : '', address || '');

  const createNewSession = async () => {
    if (!aminal || !address || isCreating) return;

    setIsCreating(true);
    try {
      const response = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aminalAddress: contractAddress,
          userAddress: address,
          title: `Chat ${new Date().toLocaleDateString()}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create chat session');
      }

      const newSession: ChatSession = await response.json();
      
      // Navigate to the new chat session
      router.push(`/aminals/${contractAddress}/chat/${newSession.id}`);
    } catch (error) {
      console.error('Error creating chat session:', error);
      toast.error('Failed to create new chat session');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isRouterReady || isAminalLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!aminal) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-[50vh] text-gray-500">
            Aminal not found
          </div>
        </div>
      </Layout>
    );
  }

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return messageDate.toLocaleDateString();
  };

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href={`/aminals/${contractAddress}`}
              className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-50 border border-gray-200">
              <AminalVisualImage aminal={aminal} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Chat with Aminal #{aminal.aminalIndex}
              </h1>
              <p className="text-gray-600">
                {aminal.lovers?.[0]?.love ? 
                  `Love: ${Number(aminal.lovers[0].love).toFixed(1)} ❤️` : 
                  'New friend 👋'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Create New Chat Button */}
        <div className="mb-6">
          <Button
            onClick={createNewSession}
            disabled={isCreating || !address}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isCreating ? 'Creating...' : 'Start New Conversation'}
          </Button>
          {!address && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Connect your wallet to start chatting
            </p>
          )}
        </div>

        {/* Chat Sessions List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Conversations</h2>
          
          {isSessionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : !sessions || sessions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-gray-600 mb-4">
                Start your first conversation with this Aminal!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session: ChatSession) => (
                <Link
                  key={session.id}
                  href={`/aminals/${contractAddress}/chat/${session.id}`}
                  className="block p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {session.title}
                      </h3>
                      {session.messages.length > 0 && (
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {session.messages[session.messages.length - 1].text}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {session.messages.length}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(session.updatedAt.toString())}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChatSessionsPage;