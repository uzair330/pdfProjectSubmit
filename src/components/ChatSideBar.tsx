"use client";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";
import { MessageCircle, PlusCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import SubscriptionButton from "./SubscriptionButton";
import FileUpload from "./FileUpload";





type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
};

const ChatSideBar = ({ chats, chatId, isPro }: Props) => {
  const [loading, setLoading] = React.useState(false);

  return (
    <div className=" h-screen  p-4 text-gray-200 bg-gray-900 flex flex-col justify-between w-72 md:w-96 ">
          <div className="flex max-h-screen  flex-col gap-2 mt-3 ">
        <h1 className="font-bold text-2xl pb-4 text-blue-700">Navigating-PDF</h1>
             {chats.map((chat) => (

          <div className="flex justify-between items-center bg-slate-800 rounded-md p-2 ">

            
            <div
              className={cn("rounded-lg p-3 text-slate-300 flex items-center justify-between w-[65%]", {
                "bg-blue-600 text-white gap-y-2 w-[65%] ": chat.id === chatId,
                "hover:text-white ": chat.id !== chatId,
              })}
              >
                
              <Link key={chat.id} href={`/chat/${chat.id}`}>
              <div className="flex">

              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis ">
                {chat.pdfName}
              </p>
              </div>
          </Link>
            </div>


           






<div className="">

            <X 
            
            className="text-red-600 bg-slate-900 rounded-md p-1 shadow-sm"
            />
            </div>
          
              </div>
        ))}
        
      </div>
      
        <FileUpload />
      <div className="flex justify-start">
                  <SubscriptionButton isPro={isPro} />
                </div>

   
    </div>
  );
};

export default ChatSideBar;
