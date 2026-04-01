import express from "express";
import http from "http";
import { Server } from "socket.io";
import setupSocket from "./socket-io.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

setupSocket(io);

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
