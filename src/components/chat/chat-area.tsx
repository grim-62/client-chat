"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  Send, 
  Paperclip, 
  Smile,
  MoreVertical,
  Phone,
  Video
} from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppSelector } from "@/store/hooks"
import { selectChatfriend } from "@/store/slice/chatSlice"
import { useChat } from "@/hooks/use-chat-socket"
import { selectUser } from "@/store/slice/user.slice"
// import { useChatEvents, useChatActions } from "@/context/socket-provider"
// import { useMessages } from "@/hooks/use-messages"
// import { useChat } from "@/hooks/use-chat"
// import { Message, Attachment } from "@/context/socket-provider"


export function ChatArea() {
  const selectedFriend = useAppSelector(selectChatfriend)
  const [message, setMessage] = useState("")
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const currentUser = useAppSelector(selectUser)
  const ChatDetail = useAppSelector(selectChatfriend)
  const user = { _id: currentUser._id, username: currentUser.username }

  const { messages, sendMessage, isTyping, startTyping, stopTyping }= useChat(user,ChatDetail._id, ChatDetail.members,)

    const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("")
    stopTyping();
  };
  // const { chat, isLoading: chatLoading } = useChat(chatId)
  // const { messages, isLoading: messagesLoading, addMessage } = useMessages(chatId)
  // const { onNewMessage, onTypingStart, onTypingEnd, onMessageSent } = useChatEvents()
  // const { startTyping, stopTyping, sendMessage: sendMessageSocket } = useChatActions()

  // Handle new messages
  // useEffect(() => {
  //   const unsubscribeNewMessage = onNewMessage((event) => {
  //     if (event.chatId === chatId) {
  //       // Append incoming message and scroll
  //       addMessage(event.message as unknown as Message)
  //       scrollToBottom()
  //     }
  //   })

  //   return unsubscribeNewMessage
  // }, [onNewMessage, chatId, addMessage])

  // Handle typing indicators
  // useEffect(() => {
  //   const unsubscribeTypingStart = onTypingStart((event) => {
  //     if (event.chatId === chatId && event.user !== currentUserId) {
  //       setTypingUsers(prev => new Set(prev).add(event.user))
  //     }
  //   })

  //   const unsubscribeTypingEnd = onTypingEnd((event) => {
  //     if (event.chatId === chatId && event.user !== currentUserId) {
  //       setTypingUsers(prev => {
  //         const newSet = new Set(prev)
  //         newSet.delete(event.user)
  //         return newSet
  //       })
  //     }
  //   })

  //   return () => {
  //     unsubscribeTypingStart()
  //     unsubscribeTypingEnd()
  //   }
  // }, [onTypingStart, onTypingEnd, chatId, currentUserId])

  // Handle message sent confirmation
  // useEffect(() => {
  //   const unsubscribeMessageSent = onMessageSent((response) => {
  //     if (response.ok) {
  //       setMessage("")
  //       scrollToBottom()
  //     } else {
  //       console.error("Failed to send message:", response.error)
  //       // You could show a toast notification here
  //     }
  //   })

  //   return unsubscribeMessageSent
  // }, [onMessageSent])

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }, 100)
  }

  // Scroll to bottom when messages list updates
  // useEffect(() => {
  //   if (!messagesLoading) {
  //     scrollToBottom()
  //   }
  // }, [messagesLoading, messages])

  // const handleSendMessage = async () => {
  //   const payload = {
  //     id: selectedFriend._id,
  //     content: message.trim(),
  //     attachments: []
  //   }

    // Emit over socket so all clients receive message_new
    // sendMessageSocket(payload)
  // }

  // const handleTyping = (isTyping: boolean) => {
  //   if (isTyping && !typingUsers.has(currentUserId)) {
  //     startTyping({
  //       chatId,
  //       members: chat?.members.map(m => m._id) || []
  //     })
  //   } else if (!isTyping && typingUsers.has(currentUserId)) {
  //     stopTyping({
  //       chatId,
  //       members: chat?.members.map(m => m._id) || []
  //     })
  //   }
  // }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      // handleSendMessage()
      handleSend()
    }
  }

  // Autofocus input when chat loads/changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [selectedFriend])

  // if (chatLoading || messagesLoading) {
  //   return (
  //     <div className="flex-1 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
  //         <p className="text-muted-foreground">Loading chat...</p>
  //       </div>
  //     </div>
  //   )
  // }

  // if (!chat) {
  //   return (
  //     <div className="flex-1 flex items-center justify-center">
  //       <div className="text-center">
  //         <h2 className="text-xl font-semibold mb-2">Chat not found</h2>
  //         <p className="text-muted-foreground">The chat you're looking for doesn't exist.</p>
  //       </div>
  //     </div>
  //   )
  // }

  // const otherMember = chat.groupChat ? null : (chat.members.find(m => m._id !== currentUserId) || chat.members[0])

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={selectedFriend?.isGroup ? selectedFriend.avatar : selectedFriend?.profileImage} />
            <AvatarFallback>
              {selectedFriend?.isGroup ? selectedFriend.username?.charAt(0) : selectedFriend?.username?.charAt(0) || selectedFriend?.email?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {selectedFriend?.isGroup ? selectedFriend?.chatName : (selectedFriend?.username || selectedFriend?.email)}
            </h3>
            <p className="text-sm text-muted-foreground">
              {/* {data?.groupChat 
                ? `${data?.members.length} members`
                : data?.member?.isOnline ? "Online" : "Offline"
              } */}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              {/* {chat.groupChat && (
                <>
                  <DropdownMenuItem>Add Members</DropdownMenuItem>
                  <DropdownMenuItem>Group Settings</DropdownMenuItem>
                </>
              )} */}
              <DropdownMenuItem className="text-destructive">
                {/* {chat.groupChat ? "Leave Group" : "Block User"} */}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

       {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
       {/* {messages.map((m, i) => (
          <p key={i}>
            <strong>{m.senderId === selectedFriend._id ?  "Them" : "Me" }:</strong> {m.message}
          </p>
        ))} */}

        <div className="space-y-4">
          {messages.map((msg,i) => (
            <div
              key={i}
              className={`flex gap-3 ${
                msg.sender._id === currentUser._id ? "justify-end":  "justify-start" 
              }`}
            >
              {/* {msg.senderId === selectedFriend._id && (
                (() => {
                  const senderUser = chat.members.find(m => m._id === msg.sender._id)
                  return (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={senderUser?.avatar} />
                      <AvatarFallback>{senderUser?.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )
                })()
              )} */}
              
              <div
                className={`max-w-[70%] ${
                  msg.sender._id === selectedFriend._id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                } rounded-lg p-3`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content || ""}</p>
                
                {/* {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {msg.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4" />
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm underline hover:no-underline"
                        >
                          Attachment {index + 1}
                        </a>
                      </div>
                    ))}
                  </div>
                )} */}
                
                <div className="text-xs opacity-70 mt-1">
                  {/* {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })} */}
                </div>
              </div>
            </div>
          ))}
          
          {/* // Typing indicator  */}
          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea> 

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Smile className="h-4 w-4" />
          </Button>
          
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            // onFocus={() => handleTyping(true)}
            // onBlur={() => handleTyping(false)}
            className="flex-1"
            ref={inputRef}
          />
          
          <Button onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
