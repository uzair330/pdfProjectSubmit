import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";

import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PDFViewer from "@/components/PDFViewer";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
  const isPro = await checkSubscription();

  return (
    // <div className="flex max-h-screen overflow-scroll">
    //   <div className="flex w-full max-h-screen overflow-scroll">
    //     {/* chat sidebar */}
    //     <div className="flex-[1] max-w-xs">
    //       <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} />
    //     </div>
    //     {/* pdf viewer */}
    //     <div className="max-h-screen p-4 oveflow-scroll flex-[5]">
    //       <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
    //     </div>
    //     {/* chat component */}
    //     <div className="flex-[3] border-l-4 border-l-slate-200">
    //       <ChatComponent chatId={parseInt(chatId)} />
    //     </div>
    //   </div>
    // </div>

<div className="flex    gap-4">
  <div className="">
    {/* chat sidebar */}
         <div className="">
           <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} />
        </div>
  </div>
 <div className="flex flex-col justify-between mx-4  ">
 
<div className="flex justify-between">

  <div className="pt-20  font-bold text-xl md:text-2xl">
  Navigating PDF Documents with AI
  </div>

  <div className="pt-20 ">
  <Dialog
 
>
      <DialogTrigger asChild>
      {/* <div className="border text-xs border-white p-2 rounded-md mx-2">
  
</div> */}
        <Button
        variant={"destructive"}
        className="border sm:text-[8px] text-sm truncate p-2 rounded-md mx-2"
        >View PDF</Button>
      </DialogTrigger>
      <DialogContent className="w-[100%] h-[80%] ">
        
        <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
        
      </DialogContent>
    </Dialog>
  </div>
</div>
  <p>New erra of artificial intelegence</p>

  <div className="mr-4">
      <ChatComponent chatId={parseInt(chatId)} />
  
 </div>

  </div>


</div>


  );
};

export default ChatPage;
