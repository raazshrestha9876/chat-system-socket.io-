// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000"); // Use your server's URL

// socket.on("connect", () => {
//   console.log("Connected to server:", socket.id);

//   // Join a private room
//   socket.emit("joinPrivateRoom", { senderId: "user1", receiverId: "user2" });

//   // Send a private message
//   socket.emit("sendPrivateMessage", {
//     senderId: "user1",
//     receiverId: "user2",
//     content: "Hello from user1!",
//   });

//   // Listen for private messages
//   socket.on("receivePrivateMessage", (data) => {
//     console.log("Private message received:", data);
//   });

//   // Join a group room
//   socket.emit("joinGroupRoom", "group1");

//   // Send a group message
//   socket.emit("sendGroupMessage", {
//     groupId: "group1",
//     senderId: "user1",
//     content: "Hello group!",
//   });

//   // Listen for group messages
//   socket.on("receiveGroupMessage", (data) => {
//     console.log("Group message received:", data);
//   });
// });

// socket.on("disconnect", () => {
//   console.log("Disconnected from server");
// });
