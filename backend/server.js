import app from "./app.js";
import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  pingTimeout: 60000,
});
io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("joinPrivateRoom", ({ senderId, receiverId }) => {
    const roomId = [senderId, receiverId].sort().join("-");
    socket.join(roomId);
    console.log(`User joined private room: ${roomId}`);
  });
  socket.on(
    "sendPrivateMessage",
    ({ senderId, receiverId, content, fileUrl }) => {
      const roomId = [senderId, receiverId].sort().join("-");
      const messageData = {
        senderId,
        receiverId,
        content,
        fileUrl,
      };
      socket.to(roomId).emit("receivePrivateMessage", messageData);
      console.log(`Private message sent in room ${roomId}: `, messageData);
    }
  );

  socket.on("joinGroupRoom", (groupId) => {
    socket.join(groupId);
    console.log(`User joined group: ${groupId}`);
  });

  socket.on("sendGroupMessage", ({ groupId, senderId, content,  }) => {
    const messageData = {
      groupId,
      senderId,
      content,
      
    };
    socket.to(groupId).emit("receiveGroupMessage", messageData);
    console.log(`Group message sent in group ${groupId}: `, messageData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
