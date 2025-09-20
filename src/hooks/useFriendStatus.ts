// "use client";
// import { useEffect } from "react";
// import { getSocket } from "@/lib/socket";
// import { useDispatch } from "react-redux";
// import { updateFriendStatus } from "@/store/slice/chatSlice";

// export function useFriendStatus(userId: string) {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const socket = getSocket();

//     // join global presence channel with your userId
//     socket.emit("joinPresence", { userId });

//     socket.on("userOnline", ({ userId }: { userId: string }) => {
//       dispatch(updateFriendStatus({ userId, online: true }));
//     });

//     socket.on("userOffline", ({ userId }: { userId: string }) => {
//       dispatch(updateFriendStatus({ userId, online: false }));
//     });

//     return () => {
//       socket.off("userOnline");
//       socket.off("userOffline");
//     };
//   }, [dispatch, userId]);
// }
