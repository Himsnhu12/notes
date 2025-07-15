require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const noteRoutes = require("./routes/noteRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use("/notes", noteRoutes);

const usersInRoom = {};

io.on("connection", (socket) => {
  socket.on("join_note", (noteId) => {
    socket.join(noteId);
    if (!usersInRoom[noteId]) usersInRoom[noteId] = new Set();
    usersInRoom[noteId].add(socket.id);
    io.to(noteId).emit("active_users", usersInRoom[noteId].size);

    socket.on("note_update", ({ noteId, content }) => {
      socket.to(noteId).emit("note_update", content);
    });

    socket.on("disconnect", () => {
      for (const room in usersInRoom) {
        if (usersInRoom[room].has(socket.id)) {
          usersInRoom[room].delete(socket.id);
          io.to(room).emit("active_users", usersInRoom[room].size);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
