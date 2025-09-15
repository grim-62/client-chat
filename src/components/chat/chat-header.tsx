"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useChat } from "@/hooks/use-chat"

interface ChatHeaderProps {
  selectedChat: string | null
  onToggleSidebar: () => void
  isSidebarOpen: boolean
}

export function ChatHeader({ selectedChat, onToggleSidebar }: ChatHeaderProps) {
  const { chat, isLoading } = useChat(selectedChat || "")

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {selectedChat && !isLoading && chat && (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={chat?.avatar} />
              <AvatarFallback>
                {chat.groupChat ? chat.name?.charAt(0) : chat.members[0]?.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">
                {chat.groupChat ? chat.name : chat.members[0]?.username}
              </span>
              <span className="text-xs text-muted-foreground">
                {chat.groupChat
                  ? `${chat.members.length} members`
                  : chat.members[0]?.isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {selectedChat && (
          <div className="text-sm text-muted-foreground">Real-time messaging enabled</div>
        )}
      </div>
    </div>
  )
}
