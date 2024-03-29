"use client";
import React from "react";

import { useChat } from "ai/react";

import { Send } from "lucide-react";
import MessageList from "./MessageList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
type Props = { chatId: number };

const ChatComponent = ({ chatId }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  });
  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
<div className="">
<div className="">
<ScrollArea className="h-72 w-full rounded-md border ">
      {/* message list */}
      <Card className="w-[100%] h-[100%] border border-none">
      
      <CardContent>
      <MessageList messages={messages} isLoading={isLoading} />
      </CardContent>
    
    </Card>

      {/* <MessageList messages={messages} isLoading={isLoading} /> */}
</ScrollArea> 
</div>

<div className="">
<form
        onSubmit={handleSubmit}
        className="sticky bottom-0 inset-x-0 px-2 py-4  bg-white"
      >
        <div className="flex mt-8 ">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="chat with pdf..."
            className="w-full "
          />
          <Button className="bg-blue-600 ml-2">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
</div>
</div>
  );
};

export default ChatComponent;
