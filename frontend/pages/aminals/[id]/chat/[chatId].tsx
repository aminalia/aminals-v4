import { AminalVisualImage } from '@components/AminalCard';
import { Button } from '@components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, MessageCircle, Send, Sparkles } from 'lucide-react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAccount } from 'wagmi';
import { Message } from '../../../../lib/chat-storage';
import { useAminalByContractAddress } from '../../../../src/hooks/useAminals';
import Layout from '../../../_layout';

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
  const [displayPersonality, setDisplayPersonality] = useState<string | null>(
    null
  );
  const [showPersonality, setShowPersonality] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isRouterReady = router.isReady && !!id && !!chatId;

  const { data: aminal, isLoading: isAminalLoading } =
    useAminalByContractAddress(
      isRouterReady ? contractAddress : '',
      address || ''
    );

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
    const sessionMessageIds = new Set(
      session.messages.map((msg: Message) => msg.id)
    );
    const newLocalMessages = localMessages.filter(
      (msg) => !sessionMessageIds.has(msg.id)
    );

    const combined = [...session.messages, ...newLocalMessages];

    // Filter out the initial Claude message from user
    const filteredMessages = combined.filter((msg) => {
      if (msg.sender === 'user' && msg.text === 'Greetings') {
        return false;
      }
      return true;
    });

    console.log('💬 Combined messages:', {
      sessionMessages: session.messages.length,
      localMessages: localMessages.length,
      newLocalMessages: newLocalMessages.length,
      combined: combined.length,
      filtered: filteredMessages.length,
    });

    return filteredMessages;
  }, [session, localMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send initial message for new sessions
  useEffect(() => {
    if (
      session &&
      session.messages.length === 0 &&
      localMessages.length === 0 &&
      !isLoading
    ) {
      const initialMessage = 'Greetings';

      // Prepare gene IDs for personality generation (using flexible gene slots)
      const geneIds = {
        genes: aminal?.genes.map((id) => id.toString()) || [],
      };

      console.log('aminal: ', aminal);

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
          loveAmount: Number(aminal?.lovers?.items?.[0]?.love || 0),
          aminalAddress: contractAddress,
          geneIds,
          aminalStats: {
            energy: Number(aminal?.energy || 0),
            totalLove: Number(aminal?.totalLove || 0),
            ethBalance: aminal?.ethBalance ? aminal.ethBalance.toString() : '0',
            aminalIndex: Number(aminal?.aminalIndex || 0),
          },
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.response) {
            // Only show the AI response, not the initial user message
            setLocalMessages([data.response]);
          }
          setTimeout(() => {
            refetchSession();
            setTimeout(() => setLocalMessages([]), 500);
          }, 1000);
        })
        .catch((error) => {
          console.error('Error sending initial message:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [
    session,
    aminal,
    localMessages.length,
    sessionId,
    contractAddress,
    isLoading,
    refetchSession,
  ]);

  // Set personality when session loads
  useEffect(() => {
    if (session && session.personality && !displayPersonality) {
      setDisplayPersonality(session.personality);
      console.log(
        '🎭 Using stored personality from session:',
        session.personality
      );
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
    setLocalMessages((prev) => {
      const updated = [...prev, tempUserMessage];
      console.log('💬 Updated local messages:', updated.length);
      return updated;
    });
    setInputMessage('');
    setIsLoading(true);

    // Prepare gene IDs for personality generation (using flexible gene slots)
    const geneIds = {
      genes: aminal.genes.map((id) => id.toString()),
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
          loveAmount: Number(aminal.lovers?.items?.[0]?.love || 0),
          aminalAddress: contractAddress,
          geneIds,
          aminalStats: {
            energy: Number(aminal.energy || 0),
            totalLove: Number(aminal.totalLove || 0),
            ethBalance: aminal.ethBalance ? aminal.ethBalance.toString() : '0',
            aminalIndex: Number(aminal.aminalIndex || 0),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Replace temp message with real messages from server
      setLocalMessages((prev) => {
        const filteredMessages = prev.filter(
          (msg) => msg.id !== tempUserMessage.id
        );
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
      setLocalMessages((prev) =>
        prev.filter((msg) => msg.id !== tempUserMessage.id)
      );
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
          <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
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
          <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
            Chat session not found
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto my-auto px-2 sm:px-4 py-2 sm:py-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-card rounded-t-lg">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Link
              href={`/aminals/${contractAddress}/chat`}
              className="text-energy hover:text-energy/80 p-1 sm:p-2 hover:bg-energy/10 rounded-lg transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-muted border border-border flex-shrink-0">
              <AminalVisualImage aminal={aminal} />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg font-semibold truncate">
                Aminal #
                {aminal.aminalIndex !== undefined
                  ? Number(aminal.aminalIndex)
                  : 'Unknown'}
              </h1>
              <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:gap-2">
                <MessageCircle className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{session.title}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground flex-shrink-0">
            <span className="hidden sm:inline">
              {aminal.lovers?.items?.[0]?.love
                ? `Love 4 U: ${Number(aminal.lovers.items[0].love).toFixed(
                    1
                  )} 💜`
                : 'New friend 👋'}
            </span>
            <span className="sm:hidden">
              {aminal.lovers?.items?.[0]?.love
                ? `${Number(aminal.lovers.items[0].love).toFixed(1)} 💜`
                : '👋'}
            </span>
            {displayPersonality && (
              <button
                onClick={() => setShowPersonality(!showPersonality)}
                className="flex items-center gap-1 px-2 py-1 bg-energy/10 text-energy rounded-full hover:bg-energy/20 transition-colors text-xs"
              >
                <Sparkles className="w-3 h-3" />
                <span className="hidden sm:inline">Personality</span>
              </button>
            )}
          </div>
        </div>

        {/* Personality Display */}
        {showPersonality && displayPersonality && (
          <div className="px-3 sm:px-4 py-3 bg-energy/10 border-t border-energy/30">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-energy mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-energy mb-1">
                  Personality
                </h4>
                <p className="text-sm text-energy leading-relaxed">
                  {displayPersonality}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-muted border border-border">
          {messages.map((message: Message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[280px] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-energy text-white rounded-br-sm'
                    : 'bg-card text-foreground rounded-bl-sm border border-border'
                }`}
              >
                <div className="text-sm leading-relaxed break-words font-mono prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-pre:bg-muted prose-pre:text-foreground prose-code:text-foreground prose-blockquote:border-l-energy prose-blockquote:text-foreground/80 prose-strong:text-foreground prose-em:text-foreground">
                  {message.sender === 'user' ? (
                    <p className="whitespace-pre-wrap my-0">{message.text}</p>
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.text}
                    </ReactMarkdown>
                  )}
                </div>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === 'user'
                      ? 'text-white/70'
                      : 'text-muted-foreground'
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-card text-foreground rounded-2xl rounded-bl-sm border border-border px-3 sm:px-4 py-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 border-t border-border bg-card rounded-b-lg">
          <div className="flex gap-3">
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full px-3 py-2 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-energy focus:border-transparent text-sm sm:text-base"
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              variant="energy"
              className="rounded-lg h-10 w-10 flex touch-manipulation"
            >
              <Send />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ChatSessionPage;
