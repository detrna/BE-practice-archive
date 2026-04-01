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

      const targetRoom = data.roomId;

      const roomSize = io.sockets.adapter.rooms.get(targetRoom)?.size || 0;

      io.to(targetRoom).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
