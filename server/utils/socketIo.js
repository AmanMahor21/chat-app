const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { userInfo } = require("os");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Allow only this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these methods
    credentials: true, // Allow credentials to be sent
  })
);
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const activeUser = {};
io?.on("connection", (socket) => {
  const userId = socket?.handshake?.query?.userId;
  activeUser[userId] = socket?.id;

  if (!userId) {
    console.error("Connection attempt without userId");
    socket.disconnect();
    return;
  }

  io.emit("activeUser", Object.keys(activeUser));

  // let date = new Date();
  // let dateHolder = new Intl.DateTimeFormat("en-US").format(date);
  // console.log(dateHolder);
  // io.emit("date", dateHolder);

  socket.on("disconnect", () => {
    console.error("user disconnect:", socket.id);
    delete activeUser[userId];
    io.emit("activeUser", Object.keys(activeUser)); // Emit the updated active users list to all clients
    // io.emit("date", dateHolder);
  });
  // console.log(activeUser, "activeUser", "activeUser");
});

io?.on("error", (err) => {
  console.error("Socket error:", err);
});
console.log(activeUser, "activeUser activeUser");
const activeIds = (rcv) => {
  const activeMap = Object.keys(activeUser);
  return activeUser[rcv]; // Directly return the socket ID
};
module.exports = { app, httpServer, activeUser, io, activeUser, activeIds };
