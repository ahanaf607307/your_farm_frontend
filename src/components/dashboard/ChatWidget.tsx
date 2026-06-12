'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { toggleChat, selectChatUser } from '@/redux/slices/uiSlice';
import { axiosInstance } from '@/lib/axios';
import { ChatSession, Message } from '@/types';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  X,
  ArrowLeft,
  Send,
  Paperclip,
  Smile,
  Circle,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

export default function ChatWidget() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { chatOpen, selectedChatUserId } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Chat Sessions
  const { data: sessions = [] } = useQuery<ChatSession[]>({
    queryKey: ['chat-sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const res = await axiosInstance.get(`/chat/sessions/${user.id}/${user.role}`);
      return res.data;
    },
    enabled: !!user && chatOpen,
  });

  // 2. Fetch Messages for active thread
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['chat-messages', user?.id, selectedChatUserId],
    queryFn: async () => {
      if (!user || !selectedChatUserId) return [];
      const res = await axiosInstance.get(`/chat/messages/${user.id}-${selectedChatUserId}`);
      return res.data;
    },
    enabled: !!user && !!selectedChatUserId && chatOpen,
    refetchInterval: 4000, // Poll every 4s for mock chat responses
  });

  // 3. Send Message Mutation
  const sendMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user || !selectedChatUserId) return;
      const res = await axiosInstance.post('/chat/messages', {
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        receiverId: selectedChatUserId,
        content,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', user?.id, selectedChatUserId] });
      queryClient.invalidateQueries({ queryKey: ['chat-sessions', user?.id] });
      
      // Trigger a simulated responder after 2 seconds
      setTimeout(() => {
        simulateResponse();
      }, 2000);
    },
  });

  // Simulated auto-responder to make the chat feel real
  const simulateResponse = async () => {
    if (!user || !selectedChatUserId) return;
    const activePartner = sessions.find(s => s.userId === selectedChatUserId);
    if (!activePartner) return;

    const replies = [
      "I am currently reviewing the feed schedule, looks all good.",
      "Just finished administering the morning vaccine. Marking the task complete now.",
      "Will check the stock inventory right away.",
      "Yes, I will submit the daily farm status report before checking out.",
      "Could we request more calcium supplements? The stock is looking low.",
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    await axiosInstance.post('/chat/messages', {
      senderId: selectedChatUserId,
      senderName: activePartner.userName,
      senderRole: activePartner.userRole,
      receiverId: user.id,
      content: randomReply,
    });

    queryClient.invalidateQueries({ queryKey: ['chat-messages', user?.id, selectedChatUserId] });
    queryClient.invalidateQueries({ queryKey: ['chat-sessions', user?.id] });
    
    toast.message(`New message from ${activePartner.userName}`, {
      description: randomReply,
    });
  };

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || sendMutation.isPending) return;
    sendMutation.mutate(inputText);
    setInputText('');
  };

  const activePartner = sessions.find((s) => s.userId === selectedChatUserId);

  if (!user || !chatOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] border bg-card text-card-foreground rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
      {/* Header */}
      <div className="h-14 bg-zinc-950 text-white px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          {selectedChatUserId && (
            <button
              onClick={() => dispatch(selectChatUser(null))}
              className="p-1 hover:bg-zinc-850 rounded"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-orange-400" />
            <span className="font-bold text-sm">
              {selectedChatUserId && activePartner
                ? activePartner.userName
                : 'Internal Messenger'}
            </span>
          </div>
        </div>
        <button
          onClick={() => dispatch(toggleChat())}
          className="p-1 hover:bg-zinc-850 rounded text-zinc-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950/20 p-4">
        {selectedChatUserId === null ? (
          /* Inbox View */
          <div className="space-y-3">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Conversations List
            </div>
            {sessions.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                No employees or managers available in business workspace.
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.userId}
                  onClick={() => dispatch(selectChatUser(session.userId))}
                  className="p-3 border rounded-xl bg-card hover:border-orange-500/30 transition-all duration-200 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={session.profileImage} />
                        <AvatarFallback className="bg-orange-500/10 text-primary font-bold text-xs">
                          {session.userName.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {session.onlineStatus && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-orange-500 border-2 border-card" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        {session.userName}
                        <span className="text-3xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-normal">
                          {session.userRole.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-2xs text-muted-foreground truncate mt-0.5 max-w-[170px]">
                        {session.lastMessage}
                      </p>
                    </div>
                  </div>
                  {session.unreadCount > 0 && (
                    <span className="h-5 w-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                      {session.unreadCount}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          /* Chat Thread View */
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="py-16 text-center text-xs text-muted-foreground">
                Start of message logs. Type below to write a message.
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === user.id;
                return (
                  <div
                    key={msg.id}
                    className={cn('flex flex-col max-w-[75%]', isMe ? 'ml-auto items-end' : 'mr-auto items-start')}
                  >
                    <div
                      className={cn(
                        'px-3 py-2.5 rounded-2xl text-xs leading-relaxed',
                        isMe
                          ? 'bg-orange-600 text-white rounded-tr-none'
                          : 'bg-card border text-foreground rounded-tl-none'
                      )}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[9px] text-zinc-500 font-mono mt-1 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Footer (Thread view only) */}
      {selectedChatUserId !== null && (
        <form onSubmit={handleSend} className="p-3 border-t bg-card flex items-center space-x-2 shrink-0">
          <Button variant="ghost" size="icon" type="button" className="text-muted-foreground h-8 w-8 shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Write message..."
            className="text-xs h-8"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!inputText.trim() || sendMutation.isPending}
            className="h-8 w-8 bg-orange-600 hover:bg-orange-700 text-white shrink-0"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      )}
    </div>
  );
}
