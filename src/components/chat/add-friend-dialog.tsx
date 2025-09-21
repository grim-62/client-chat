"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSearchUsers } from "@/hooks/use-search-users";
import { Search, UserPlus, Check, X } from "lucide-react";

import { toast } from "sonner";
import { useSendFriendRequest } from "@/hooks/use-send-friend-request";

interface AddFriendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
}

export function AddFriendDialog({
  open,
  onOpenChange,
  currentUserId,
}: AddFriendDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { searchUsers } = useSearchUsers();
  const { sendFriendRequest, isLoading: isSending } = useSendFriendRequest();

  useEffect(() => {

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchUsers(searchQuery.trim());
        setSearchResults(results);
      } catch (error) {
        // console.error("Failed to search users:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 1000); 

    return () => clearTimeout(delayDebounce); 
  }, [searchQuery]);

  const handleSendRequest = async (userId: string) => {
    try {
      const res  = await sendFriendRequest(userId)
      // Remove the user from search results after sending request
      // setSearchResults(prev => prev.filter(user => user._id !== userId))
    } catch (error) {
      console.error("Failed to send friend request:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Friends</DialogTitle>
          <DialogDescription>
            Search for users and send them friend requests to start chatting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search-users">Search Users</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-users"
                  placeholder="Enter username or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <Label>Search Results</Label>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-3 p-3 rounded-lg border transition-all ease-in-out duration-500"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.username?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {user.isFriend ? (
                          <Badge variant="secondary">
                            <Check className="h-3 w-3 mr-1" />
                            Already Friends
                          </Badge>
                        ) : user.requestSent ? (
                          <Badge variant="outline">
                            <Check className="h-3 w-3 mr-1" />
                            Request Sent
                          </Badge>
                        ) : user._id === currentUserId ? (
                          <Badge variant="outline">You</Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleSendRequest(user._id)}
                            disabled={isSending}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Add Friend
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* No Results */}
          {searchQuery && searchResults.length === 0 && !isSearching && (
            <div className="text-center text-muted-foreground py-8">
              <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No users found matching "{searchQuery}"</p>
              <p className="text-sm">
                Try searching with a different username or email
              </p>
            </div>
          )}

          {/* Search Tips */}
          {!searchQuery && searchResults.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <UserPlus className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Search for users to add as friends</p>
              <p className="text-sm">
                You can search by username or email address
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
