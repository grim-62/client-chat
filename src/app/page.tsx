"use client"

import { useState, useEffect } from "react"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatArea } from "@/components/chat/chat-area"
import { ChatHeader } from "@/components/chat/chat-header"
// import { useSocket } from "@/context/socket-provider"
// import { useAuth } from "@/hooks/use-auth"
import FooterSidebar from "@/components/chat/sidebar-footer"
import { useAppSelector } from "@/store/hooks"
// import { selectUser } from "@/store/slices/authSlice"
// import { current } from "@reduxjs/toolkit"

export default function Home() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  // const socket = useSocket()
  // const user = useAppSelector(selectUser)


  // useEffect(() => {
  //   if (socket.connected) {
  //     console.log("Socket connected in chat page")
  //   }
  // }, [socket.connected])

  // if (!user) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-semibold mb-2">Please log in</h2>
  //         <p className="text-muted-foreground">You need to be authenticated to access the chat.</p>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-96' : 'w-0'} transition-all duration-300 overflow-hidden`}>
        <ChatSidebar
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
          currentUserId={"user.id"}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        
        {selectedChat ? (
          <ChatArea chatId={selectedChat} currentUserId={"user.id"} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Welcome to Chat</h2>
              <p className="text-muted-foreground">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

