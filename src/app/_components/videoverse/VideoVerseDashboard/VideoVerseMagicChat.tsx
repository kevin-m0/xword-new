"use client";

import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { BookOpen, Copy, RefreshCcw, Send, Volume2Icon } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import XWSecondaryButton from "~/components/reusable/XWSecondaryButton";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: string;
}

const VideoVerseMagicChat = () => {
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSubmit = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setShowChat(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: Date.now().toString(),
        text: "I'm here to help! What would you like to know?",
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="flex h-full max-h-[600px] flex-1 flex-col overflow-hidden">
      <div className="xw-scrollbar flex-1 overflow-y-auto">
        {!showChat ? (
          <DefaultView />
        ) : (
          <div className="flex flex-col gap-8 py-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </div>
        )}
      </div>

      <div className="border-xw-secondary mb-0 mt-auto border-t py-4">
        <div className="bg-xw-background relative min-h-[100px] rounded-lg border border-white/60 p-2">
          <textarea
            className="h-full w-full resize-none border-0 bg-transparent outline-none focus:ring-0"
            placeholder="Ask a question or make a request..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2"
            onClick={handleSubmit}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xw-muted mt-2 text-center text-sm">
          ChatSonic can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};

const DefaultView = () => (
  <div className="flex flex-col items-center justify-center gap-6 py-12">
    <Image src="/icons/chatmagic.svg" height={30} width={30} alt="chat" />
    <div className="text-center">
      <h1 className="text-4xl font-medium">
        Hello, <span className="text-xw-primary">Kevin Roy</span>
      </h1>
      <p className="text-xw-muted-foreground mt-2">How can I help you today?</p>
    </div>
    <SuggestedPrompts />
  </div>
);

const SuggestedPrompts = () => (
  <div className="text-center">
    <h2 className="text-xw-muted mb-4 text-sm">Ask About:</h2>
    <div className="flex w-full max-w-lg flex-wrap justify-center gap-2">
      {[
        "Summarize meeting notes",
        "Organize projects",
        "What did they say about the new project?",
        "What did they say about the new project?",
      ].map((prompt, i) => (
        <XWSecondaryButton
          key={i}
          className2="text-xs xw-premium-div"
          rounded="full"
        >
          {prompt}
        </XWSecondaryButton>
      ))}
      <Button variant="ghost" className="h-9 rounded-full text-sm">
        <BookOpen className="mr-2 h-4 w-4" /> See prompt library
      </Button>
    </div>
  </div>
);

const MessageBubble = ({ message }: { message: ChatMessage }) => (
  <div className="flex gap-3">
    <Avatar>
      <AvatarImage
        src={
          message.sender === "user"
            ? "/images/user2.png"
            : "/icons/chatsonic-fake.svg"
        }
      />
      <AvatarFallback>{message.sender === "user" ? "U" : "AI"}</AvatarFallback>
    </Avatar>
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h3>{message.sender === "user" ? "You" : "Assistant"}</h3>
        <span className="text-xw-muted text-xs">{message.timestamp}</span>
      </div>
      <p className="text-xw-muted-foreground">{message.text}</p>
      {message.sender === "assistant" && (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost">
            <Volume2Icon className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <RefreshCcw className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost">
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  </div>
);

export default VideoVerseMagicChat;
