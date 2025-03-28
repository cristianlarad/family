"use client";

import React, { useState, useEffect } from "react";
import supabase from "@/database/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@supabase/supabase-js";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isToday, isYesterday } from "date-fns";
import { CheckCheck, MessageCircle } from "lucide-react";
import { es } from "date-fns/locale";

interface Message {
  id: string;
  content: string;
  created_at: string;
  reciveID: string;
  envioID: string;
  envioUser: User;
}

const FetchMessagesGrupo: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("message")
          .select("*")
          .eq("grupo", true)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error fetching messages:", error);
          return;
        }

        setMessages(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Unexpected error:", error);
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
      .channel("message")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message",
          filter: `grupo=eq.${true}`, // Filtrar solo mensajes para el usuario actual
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  const getInitials = (name: string) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";
  };
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);

    if (isToday(date)) {
      return format(date, "HH:mm", { locale: es });
    } else if (isYesterday(date)) {
      return "Ayer " + format(date, "HH:mm", { locale: es });
    } else {
      return format(date, "dd/MM/yy HH:mm", { locale: es });
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      const date = new Date(message.created_at);
      const dateKey = format(date, "yyyy-MM-dd");

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(message);
    });

    return groups;
  };

  // Format date for display
  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);

    if (isToday(date)) {
      return "Hoy";
    } else if (isYesterday(date)) {
      return "Ayer";
    } else {
      return format(date, "d 'de' MMMM, yyyy", { locale: es });
    }
  };

  const messageGroups = groupMessagesByDate();

  if (loading) {
    return (
      <div className="flex flex-col space-y-3 p-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="flex items-center justify-end space-x-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[300px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-muted/20 rounded-lg">
      <ScrollArea className="flex-grow px-4 py-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <MessageCircle className="h-12 w-12 text-primary" />
            </div>
            <p className="text-center font-medium mb-1">No hay mensajes aún</p>
            <p className="text-sm text-muted-foreground text-center">
              ¡Comienza la conversación enviando un mensaje!
            </p>
          </div>
        ) : (
          Object.keys(messageGroups).map((dateKey) => (
            <div key={dateKey} className="mb-4">
              <div className="flex justify-center mb-4">
                <div className="bg-muted/50 px-3 py-1 rounded-full text-xs text-muted-foreground">
                  {formatDateHeader(dateKey)}
                </div>
              </div>

              {messageGroups[dateKey].map((message, index) => {
                const isSentByMe = message.envioID === currentUser?.id;
                const userName =
                  message.envioUser?.user_metadata?.name?.split(" ")[0] ??
                  "Usuario";
                const avatarUrl = message.envioUser?.user_metadata?.avatar_url;
                const showSenderName =
                  !isSentByMe &&
                  (index === 0 ||
                    messageGroups[dateKey][index - 1].envioID !==
                      message.envioID);

                return (
                  <div
                    key={message.id}
                    className={`mb-2 ${
                      isSentByMe ? "flex flex-row-reverse" : "flex"
                    }`}
                  >
                    <div
                      className={`flex ${
                        isSentByMe ? "flex-row-reverse" : "flex-row"
                      } items-end gap-1 max-w-[85%] group`}
                    >
                      {!isSentByMe && (
                        <Avatar
                          className={`h-8 w-8 border border-border ${
                            !showSenderName ? "opacity-0 invisible" : ""
                          }`}
                        >
                          <AvatarImage src={avatarUrl} alt={userName} />
                          <AvatarFallback>
                            {getInitials(userName)}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className="flex flex-col">
                        {showSenderName && !isSentByMe && (
                          <span className="text-xs font-medium text-primary ml-1 mb-0.5">
                            {userName}
                          </span>
                        )}
                        {isSentByMe && (
                          <span className="text-xs font-medium text-primary ml-1 mb-0.5">
                            Tu
                          </span>
                        )}

                        <div
                          className={`px-3 py-2 ${
                            isSentByMe
                              ? "bg-primary text-primary-foreground rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm"
                              : "bg-secondary text-secondary-foreground rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-sm"
                          }`}
                        >
                          <p className="break-words text-sm">
                            {message.content}
                          </p>

                          <div
                            className={`flex items-center justify-end gap-1 -mb-1 mt-1 ${
                              isSentByMe
                                ? "text-primary-foreground/70"
                                : "text-secondary-foreground/70"
                            }`}
                          >
                            <span className="text-[10px]">
                              {formatMessageTime(message.created_at)}
                            </span>
                            {isSentByMe && <CheckCheck className="h-3 w-3" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} className="h-4" />
      </ScrollArea>
    </div>
  );
};

export default FetchMessagesGrupo;
