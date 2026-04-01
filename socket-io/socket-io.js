import pool from "./pool.js";

export default function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      const currentRooms = Array.from(socket.rooms);
      console.log("This socket is in:", currentRooms);
      io.emit("receive_message", "test");
    });

    socket.on("send_message", (data) => {
      console.log(data);
      io.emit("receive_message", data);
      // If Postman sends { "roomId": "1" },
      // you MUST use data.roomId here.
      const targetRoom = data.roomId;

      console.log("Sending to room:", targetRoom);

      const roomSize = io.sockets.adapter.rooms.get(targetRoom)?.size || 0;
      console.log(`Users in room: ${roomSize}`);

      io.to(targetRoom).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
