export type Friend = { id: string; name: string; status: "online" | "offline" };
export type Group = { id: string; name: string; members: number };
export type FriendRequest = { id: string; name: string };

export const FRIENDS: Friend[] = [
  { id: "1", name: "Alice", status: "online" },
  { id: "2", name: "Bob", status: "offline" },
  { id: "3", name: "Charlie", status: "online" },
  { id: "4", name: "Diana", status: "offline" },
];

export const GROUPS: Group[] = [
  { id: "g1", name: "Project Phoenix", members: 8 },
  { id: "g2", name: "Gaming Night", members: 12 },
  { id: "g3", name: "Family", members: 5 },
];

export const FRIEND_REQUESTS: FriendRequest[] = [
  { id: "r1", name: "Eve" },
  { id: "r2", name: "Frank" },
];


