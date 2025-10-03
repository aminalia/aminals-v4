import { AminalVisualImage } from '@/components/aminal-card';
import { Button } from '@/components/ui/button';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import Layout from '../../../_layout';
import { Send, ArrowLeft, MessageCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { ChatSession, Message } from '../../../../lib/chat-storage';
import { useAminalForChat } from '../../../../src/resources/aminals';

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
    refetchInterval: process.env.NODE_ENV === 'development' ? false : 5000, // Skip auto-refetch in dev mode
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
  const [displayPersonality, setDisplayPersonality] = useState<string | null>(null);
  const [showPersonality, setShowPersonality] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isRouterReady = router.isReady && !!id && !!chatId;

  const {
    data: aminal,
    isLoading: isAminalLoading,
  } = useAminalForChat(isRouterReady ? contractAddress : '', address || '');

  const {
    data: session,
    isLoading: isSessionLoading,
    refetch: refetchSession,
  } = useChatSession(isRouterReady ? sessionId : '');

  // Combine server messages with local optimistic updates
  const messages = useMemo(() => {
    if (!session) {
      console.log('💬 No session, using local messages:', localMessages.length);
      return localMessages;
    }

    // If we have local messages that aren't in the session yet, merge them
    const sessionMessageIds = new Set(session.messages.map((msg: Message) => msg.id));
    const newLocalMessages = localMessages.filter(msg => !sessionMessageIds.has(msg.id));

    const combined = [...session.messages, ...newLocalMessages];

    // Filter out the initial Claude message from user
    const filteredMessages = combined.filter(msg => {
      if (msg.sender === 'user' && msg.text === "Greetings") {
        return false;
      }
      return true;
    });

    console.log('💬 Combined messages:', {
      sessionMessages: session.messages.length,
      localMessages: localMessages.length,
      newLocalMessages: newLocalMessages.length,
      combined: combined.length,
      filtered: filteredMessages.length
    });

    return filteredMessages;
  }, [session?.messages, localMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send initial message for new sessions
  useEffect(() => {
    if (session && session.messages.length === 0 && localMessages.length === 0 && !isLoading) {
      const initialMessage = "Greetings";

      // Prepare gene IDs for personality generation
      const geneIds = {
        backId: aminal?.backId?.toString(),
        armId: aminal?.armId?.toString(),
        tailId: aminal?.tailId?.toString(),
        earsId: aminal?.earsId?.toString(),
        bodyId: aminal?.bodyId?.toString(),
        faceId: aminal?.faceId?.toString(),
        mouthId: aminal?.mouthId?.toString(),
        miscId: aminal?.miscId?.toString(),
      };

      // Send the initial message automatically
      setIsLoading(true);
      fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: initialMessage,
          sessionId: sessionId,
          loveAmount: Number(aminal?.lovers?.[0]?.love || 0),
          aminalAddress: contractAddress,
          geneIds,
          aminalStats: {
            energy: Number(aminal?.energy || 0),
            totalLove: Number(aminal?.totalLove || 0),
            ethBalance: aminal?.ethBalance || '0',
            aminalIndex: Number(aminal?.aminalIndex || 0),
          },
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.response) {
          // Only show the AI response, not the initial user message
          setLocalMessages([data.response]);
        }
        setTimeout(() => {
          refetchSession();
          setTimeout(() => setLocalMessages([]), 500);
        }, 1000);
      })
      .catch(error => {
        console.error('Error sending initial message:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  }, [session, aminal, localMessages.length, sessionId, contractAddress, isLoading, refetchSession]);


  // Set personality when session loads
  useEffect(() => {
    if (session && session.personality && !displayPersonality) {
      setDisplayPersonality(session.personality);
      console.log('🎭 Using stored personality from session:', session.personality);
    }
  }, [session, displayPersonality]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !aminal || !session || isLoading) return;

    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    // Optimistically add the message
    console.log('💬 Adding optimistic user message:', tempUserMessage);
    setLocalMessages(prev => {
      const updated = [...prev, tempUserMessage];
      console.log('💬 Updated local messages:', updated.length);
      return updated;
    });
    setInputMessage('');
    setIsLoading(true);

    // Prepare gene IDs for personality generation
    const geneIds = {
      backId: aminal.backId?.toString(),
      armId: aminal.armId?.toString(),
      tailId: aminal.tailId?.toString(),
      earsId: aminal.earsId?.toString(),
      bodyId: aminal.bodyId?.toString(),
      faceId: aminal.faceId?.toString(),
      mouthId: aminal.mouthId?.toString(),
      miscId: aminal.miscId?.toString(),
    };

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
          aminalAddress: contractAddress,
          geneIds,
          aminalStats: {
            energy: Number(aminal.energy || 0),
            totalLove: Number(aminal.totalLove || 0),
            ethBalance: aminal.ethBalance || '0',
            aminalIndex: Number(aminal.aminalIndex || 0),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Replace temp message with real messages from server
      setLocalMessages(prev => {
        const filteredMessages = prev.filter(msg => msg.id !== tempUserMessage.id);
        return [
          ...filteredMessages,
          data.message, // Real user message from server
          data.response, // AI response
        ];
      });

      // Refetch session to get the latest data, then clear local messages
      setTimeout(() => {
        refetchSession();
        // Clear local messages after successful refetch since they're now in the session
        setTimeout(() => setLocalMessages([]), 500);
      }, 1000);
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
      <div className="container max-w-4xl mx-auto px-2 sm:px-4 py-2 sm:py-4 h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-white rounded-t-lg">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Link
              href={`/aminals/${contractAddress}/chat`}
              className="text-blue-600 hover:text-blue-700 p-1 sm:p-2 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-indigo-50 border border-gray-200 flex-shrink-0">
              <AminalVisualImage aminal={aminal} />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg font-semibold truncate">
                Aminal #{aminal.aminalIndex}
              </h1>
              <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 sm:gap-2">
                <MessageCircle className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{session.title}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 flex-shrink-0">
            <span className="hidden sm:inline">
              {aminal.lovers?.[0]?.love ?
                `Love 4 U: ${Number(aminal.lovers[0].love).toFixed(1)} 💜` :
                'New friend 👋'
              }
            </span>
            <span className="sm:hidden">
              {aminal.lovers?.[0]?.love ?
                `${Number(aminal.lovers[0].love).toFixed(1)} 💜` :
                '👋'
              }
            </span>
            {displayPersonality && (
              <button
                onClick={() => setShowPersonality(!showPersonality)}
                className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors text-xs"
              >
                <Sparkles className="w-3 h-3" />
                <span className="hidden sm:inline">Personality</span>
              </button>
            )}
          </div>
        </div>

        {/* Personality Display */}
        {showPersonality && displayPersonality && (
          <div className="px-3 sm:px-4 py-3 bg-purple-50 border-t border-purple-100">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-purple-900 mb-1">
                  Personality
                </h4>
                <p className="text-sm text-purple-700 leading-relaxed">{displayPersonality}</p>
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gray-50">
          {messages.map((message: Message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[280px] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'
                }`}
              >
                <p className="text-sm leading-relaxed break-words whitespace-pre-wrap font-mono">{message.text}</p>
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
              <div className="bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-200 px-3 sm:px-4 py-2">
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
        <div className="p-3 sm:p-4 border-t border-gray-200 bg-white rounded-b-lg">
          <div className="flex gap-3">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10 w-10 flex touch-manipulation"
            >
              <Send />
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
