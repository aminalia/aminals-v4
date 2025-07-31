import { AminalVisualImage } from '@/components/aminal-card';
import { Button } from '@/components/ui/button';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import Layout from '../../../_layout';
import { Send, ArrowLeft, MessageCircle, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { ChatSession, Message } from '../../../../lib/chat-storage';

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

const useChatSession = (sessionId: string) => {
  return useQuery({
    queryKey: ['chat-session', sessionId],
    queryFn: async () => {
      if (!sessionId) return null;

      const response = await fetch(`/api/chat/sessions/${sessionId}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch chat session');
      }
      return response.json();
    },
    enabled: !!sessionId,
    refetchInterval: 5000, // Refetch every 5 seconds to get new messages
  });
};

const ChatSessionPage: NextPage = () => {
  const router = useRouter();
  const { id, chatId } = router.query;
  const contractAddress = id as string;
  const sessionId = chatId as string;
  const { address } = useAccount();
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isRouterReady =
    router.isReady && 
    id && typeof id === 'string' && id !== 'undefined' &&
    chatId && typeof chatId === 'string' && chatId !== 'undefined';

  const {
    data: aminal,
    isLoading: isAminalLoading,
  } = useAminalByAddress(isRouterReady ? contractAddress : '', address || '');

  const {
    data: session,
    isLoading: isSessionLoading,
    refetch: refetchSession,
  } = useChatSession(isRouterReady ? sessionId : '');

  // Combine server messages with local optimistic updates
  const messages = session?.messages || localMessages;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add welcome message for new sessions
  useEffect(() => {
    if (session && session.messages.length === 0 && localMessages.length === 0) {
      const loveAmount = aminal?.lovers?.[0]?.love || 0;
      let welcomeMessage = '';
      
      if (Number(loveAmount) > 20) {
        welcomeMessage = "Hey there, friend! 🐾 It's so good to see you again! What's on your mind today?";
      } else if (Number(loveAmount) > 5) {
        welcomeMessage = "Hi! 😊 I remember you! Thanks for coming to chat with me. How are you doing?";
      } else {
        welcomeMessage = "Hello there! 👋 I'm excited to meet you! I'm still getting to know humans, so please be patient with me.";
      }

      setLocalMessages([{
        id: 'welcome',
        text: welcomeMessage,
        sender: 'aminal',
        timestamp: new Date(),
      }]);
    }
  }, [session, aminal, localMessages.length]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !aminal || !session || isLoading) return;

    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    // Optimistically add the message
    setLocalMessages(prev => [...prev, tempUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          sessionId: sessionId,
          loveAmount: Number(aminal.lovers?.[0]?.love || 0),
          aminalImageUrl: aminal.tokenURI,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Add the AI response optimistically
      setLocalMessages(prev => [
        ...prev.filter(msg => msg.id !== tempUserMessage.id), // Remove temp message
        data.message, // Real user message from server
        data.response, // AI response
      ]);

      // Refetch session to get the latest data
      setTimeout(() => refetchSession(), 1000);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to send message. Please try again.');
      // Remove the optimistic message on error
      setLocalMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isRouterReady || isAminalLoading || isSessionLoading) {
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

  if (!session) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-[50vh] text-gray-500">
            Chat session not found
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-4 h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Link
              href={`/aminals/${contractAddress}/chat`}
              className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-50 border border-gray-200">
              <AminalVisualImage aminal={aminal} />
            </div>
            <div>
              <h1 className="text-lg font-semibold">
                Aminal #{aminal.aminalIndex}
              </h1>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <MessageCircle className="w-3 h-3" />
                {session.title}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {aminal.lovers?.[0]?.love ? 
              `Love: ${Number(aminal.lovers[0].love).toFixed(1)} ❤️` : 
              'New friend 👋'
            }
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message: Message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-200 px-4 py-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 h-10 w-10 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ChatSessionPage;