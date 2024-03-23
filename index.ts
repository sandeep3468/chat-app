import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { Error } from "mongoose";
import cors from "cors";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes";
// import messageRoutes from "./routes/messages";
import { notFound, errorHandle } from "./middlewares/errorHandler";

dotenv.config({ path: ".env" });
const app = express();
const port = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || "http://localhost";

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err: Error) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello World!");
});

app.use(notFound);
app.use(errorHandle);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket Connected!", socket.id);

  socket.on("welcome", (userName) => {
    onlineUsers.set(userName, socket.id);
    console.log("Total online users : ", onlineUsers.size);
  });

  socket.on("sendMessage", ({ userName, message }) => {
    console.log(
      "Message Received from ",
      userName,
      "->",
      socket.id,
      message.toString()
    );
    console.log(onlineUsers.get(userName));
    socket.to(onlineUsers.get(userName)).emit("receiveMessage", { message });
  });

  socket.on("disconnect", () => {
    console.log("Socket Disconnected!", socket.id);
    onlineUsers.delete(socket.id);
  });
});

httpServer.listen(3000);

const numCPUs = require("os").cpus().length;
console.log("Number of CPU cores ", numCPUs);
