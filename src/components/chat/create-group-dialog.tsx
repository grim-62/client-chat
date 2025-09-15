"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useFriends } from "@/hooks/use-friends"
import { useCreateGroup } from "@/hooks/use-create-group"
import { X, Search } from "lucide-react"

interface CreateGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUserId: string
}

export function CreateGroupDialog({ open, onOpenChange, currentUserId }: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  
  const { friends, isLoading: friendsLoading } = useFriends()
  const { createGroup, isLoading: isCreating } = useCreateGroup()

  const filteredFriends = friends.filter(friend =>
    friend.username?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  )

  const handleToggleMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    )
  }

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedMembers.length < 2) return

    try {
      await createGroup({
        name: groupName.trim(),
        members: selectedMembers
      })
      
      // Reset form
      setGroupName("")
      setSelectedMembers([])
      setSearchQuery("")
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create group:", error)
    }
  }

  const canCreate = groupName.trim() && selectedMembers.length >= 2

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Create a new group chat with your friends. You need at least 2 other members.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              placeholder="Enter group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          {/* Search Friends */}
          <div className="space-y-2">
            <Label>Select Members</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Selected Members */}
          {selectedMembers.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Members ({selectedMembers.length})</Label>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map(memberId => {
                  const friend = friends.find(f => f._id === memberId)
                  if (!friend) return null
                  
                  return (
                    <Badge key={memberId} variant="secondary" className="flex items-center gap-1">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback>{friend.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {friend.username}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleToggleMember(memberId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}

          {/* Friends List */}
          <div className="space-y-2">
            <Label>Friends</Label>
            <ScrollArea className="h-48">
              {friendsLoading ? (
                <div className="text-center text-muted-foreground py-4">
                  Loading friends...
                </div>
              ) : filteredFriends.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  No friends found
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFriends.map((friend) => (
                    <div
                      key={friend._id}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedMembers.includes(friend._id)
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => handleToggleMember(friend._id)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback>{friend.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{friend.username}</div>
                        <div className="text-sm text-muted-foreground">
                          {friend.isOnline ? "Online" : "Offline"}
                        </div>
                      </div>
                      {selectedMembers.includes(friend._id) && (
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateGroup}
            disabled={!canCreate || isCreating}
          >
            {isCreating ? "Creating..." : "Create Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
