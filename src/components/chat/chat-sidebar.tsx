"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  Users,
  UserPlus,
  Search,
  Plus,
  MoreVertical
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useChats } from "@/hooks/use-chats"
import { useFriends } from "@/hooks/use-friends"
import { useFriendRequests } from "@/hooks/use-friend-requests"
import { CreateGroupDialog } from "./create-group-dialog"
import { AddFriendDialog } from "./add-friend-dialog"
import FooterSidebar from "./sidebar-footer"
import { api } from "@/services/api"

interface ChatSidebarProps {
  selectedChat: string | null
  onSelectChat: (chatId: string) => void
  currentUserId: string
}

type TabType = "chats" | "friends" | "requests"

export function ChatSidebar({ selectedChat, onSelectChat, currentUserId }: ChatSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>("chats")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)

  const { chats, isLoading: chatsLoading } = useChats()
  const { friends, isLoading: friendsLoading } = useFriends()
  const { requests, isLoading: requestsLoading, respondToRequest } = useFriendRequests()

  const filteredChats = chats.filter(chat =>
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.members.some(member =>
      member.username?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    )
  )

  const filteredFriends = friends.filter(friend =>
    friend?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  )
  console.log(friends)

  const handleAcceptRequest = async (requestId: string) => {
    await respondToRequest(requestId, true)
  }

  const handleRejectRequest = async (requestId: string) => {
    await respondToRequest(requestId, false)
  }

  const openDirectChat = async (otherUserId: string) => {
    if (!otherUserId) return
    try {
      const { data } = await api.post(`/chats/direct/${otherUserId}`)
      const chatId = data?.chat?._id
      if (chatId) {
        onSelectChat(chatId)
        setActiveTab("chats")
      }
    } catch (err) {
      console.error("Failed to open direct chat", err)
    }
  }

  return (
    <div className="flex flex-col h-full bg-card border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddFriendOpen(true)}
            >
              <UserPlus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreateGroupOpen(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <Button
          variant={activeTab === "chats" ? "default" : "ghost"}
          className="flex-1 rounded-none"
          onClick={() => setActiveTab("chats")}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Chats
        </Button>
        <Button
          variant={activeTab === "friends" ? "default" : "ghost"}
          className="flex-1 rounded-none"
          onClick={() => setActiveTab("friends")}
        >
          <Users className="h-4 w-4 mr-2" />
          Friends
        </Button>
        <Button
          variant={activeTab === "requests" ? "default" : "ghost"}
          className="flex-1 rounded-none"
          onClick={() => setActiveTab("requests")}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Requests
          {requests.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {requests.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {activeTab === "chats" && (
            <div className="space-y-2">
              {friendsLoading ? (
                <div className="text-center text-muted-foreground">Loading friends...</div>
              ) : filteredFriends.length === 0 ? (
                <div className="text-center text-muted-foreground">No friends found</div>
              ) : (
                filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() => openDirectChat(friend.id )}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={friend?.avatar} />
                      <AvatarFallback>{friend.email.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{friend.username || friend.email}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {friend.isOnline ? "Online" : "Offline"}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openDirectChat(friend.id)}}>
                      Message
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "friends" && (
            <div className="space-y-2">
              {friendsLoading ? (
                <div className="text-center text-muted-foreground">Loading friends...</div>
              ) : filteredFriends.length === 0 ? (
                <div className="text-center text-muted-foreground">No friends found</div>
              ) : (
                filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() => openDirectChat(friend.id)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={friend?.avatar} />
                      <AvatarFallback>{friend.email.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{friend.username || friend.email}</div>
                      <div className="text-sm text-muted-foreground">
                        {friend.isOnline ? "Online" : "Offline"}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation() }}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => openDirectChat(friend.id)}>
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Remove Friend
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "requests" && (
            <div className="space-y-2">
              {requestsLoading ? (
                <div className="text-center text-muted-foreground">Loading requests...</div>
              ) : requests.length === 0 ? (
                <div className="text-center text-muted-foreground">No pending requests</div>
              ) : (
                requests.map((request) => (
                  <div
                    key={request._id}
                    className="flex items-center gap-3 p-3 rounded-lg border"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={request.sender.avatar} />
                      <AvatarFallback>{request.sender.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{request.sender.username}</div>
                      <div className="text-sm text-muted-foreground">Wants to be your friend</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAcceptRequest(request._id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectRequest(request._id)}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      <FooterSidebar />


      {/* Dialogs */}
      <CreateGroupDialog
        open={isCreateGroupOpen}
        onOpenChange={setIsCreateGroupOpen}
        currentUserId={currentUserId}
      />

      <AddFriendDialog
        open={isAddFriendOpen}
        onOpenChange={setIsAddFriendOpen}
        currentUserId={currentUserId}
      />
    </div>
  )
}
