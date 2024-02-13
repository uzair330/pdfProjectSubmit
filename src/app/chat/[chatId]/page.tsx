import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";

import PDFViewer from "@/components/PDFViewer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";


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
