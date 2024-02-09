import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { ArrowRight, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
 
  let firstChat;
  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstChat) {
      firstChat = firstChat[0];
    }
  }
  return (
    
    <div className="w-screen min-h-screen bg-gradient-to-r from-indigo-400 to-cyan-400">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className=" text-4xl sm:5xl md:6xl font-bold  px-6 text-slate-900">PDF Explorer 🔍
            <br />
            <span className="mr-3 text-xl ">Navigating Documents with AI</span>
            </h1>
           
            
          </div>

          <div className="flex mt-2">
            {isAuth && firstChat && (
              <>
                <Link href={`/chat/${firstChat.id}`}>
                  <Button>
                    Go to Chats <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                
              </>
            )}
          </div>

          <p className=" py-4 text-lg text-slate-600 text-left">
          PDF Explorer is an AI tool that analyzes your PDFs, answers queries, and reveals hidden insights. Simply upload your files and start exploring! 📄🔍
          </p>

          <div className="w-full mt-4 " >
            {isAuth ? (
              
              <>
              {/* text-4xl sm:5xl md:6xl  */}
              {/* <div className="flex  justify-between gap-4 items-center flex-col sm:flex-row">
                
                  <div className="">
                  <Image src="/aws.svg" width={60} height={60} alt="chat" />
                  </div>
                <div className="">
                  <Image src="/gpt.svg" width={60} height={60} alt="chat" />
                  </div>
                  <div className="">
                  <Image src="/pinecone.svg" width={60} height={60} alt="chat" />
                  </div>
                  <div className="stripe-icon">
                  <Image src="/stripe-icon.svg" width={60} height={60} alt="chat" />
                  </div>
              </div> */}


<div className="grid grid-cols-2 items-center justify-center sm:grid-cols-4">
<div className=" flex justify-center items-center">
                  <Image src="/aws.svg" width={60} height={60} alt="chat" />
                  </div>
                <div className=" flex justify-center items-center">
                  <Image src="/gpt.svg" width={60} height={60} alt="chat" />
                  </div>
                  <div className=" flex justify-center items-center">
                  <Image src="/pinecone.svg" width={60} height={60} alt="chat" />
                  </div>
                  <div className="flex justify-center items-center">
                  <Image src="/stripe-icon.svg" width={60} height={60} alt="chat" />
                  </div>
</div>

              </>
            ) : (
              <Link href="/sign-in">
                <Button>
                  Login to get Started!
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



