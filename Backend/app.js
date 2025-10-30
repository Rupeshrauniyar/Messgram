const express = require("express");
const app = express();
const { Server } = require("socket.io"); // ✅ Correct import
const MessageModel = require("./models/MessageModel.js");
const http = require("http");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
  },
});
const DB = require("./db/db");
DB();
require("dotenv").config();
const port = process.env.PORT;
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Auth = require("./routes/Auth");
const Home = require("./routes/Home");
const Search = require("./routes/Search");
const AddFriend = require("./routes/Addfriend.js");
const Message = require("./routes/Message.js");
const UserModel = require("./models/User.js");
app.use("/api", Auth);
app.use("/api", Home);
app.use("/api", Search);
app.use("/api", AddFriend);
app.use("/api", Message);


io.on("connection", (socket) => {
  socket.on("connected", (Data) => {
    //   console.log(Data)
    socket.join(`noti-${Data}`);
  });
  socket.on("send-noti", async (Data) => {
    try {
      console.log("send-noti", Data);
      const noti = await UserModel.findOneAndUpdate(
        { _id: Data.userId },
        {
          $push: {
            notification: {
              type: "friend_request",
              sender: Data._id,
              message: Data.message,
            },
          },
        },
        {
          new: true,
        }
      );
 
      socket.broadcast
        .to(`noti-${Data.userId}`)
        .emit(`noti-${Data.userId}`, noti.notification);
    } catch (err) {
      console.log(err);
    }
  });
  socket.on("initiate-call", (Data) => {
    // console.log(Data)
    socket.join(Data.chatId);
    const callData = {
      user: Data.user,
      chatId: Data.chatId,
      receiverId: Data.receiverId,
      offer: Data.offer,
    };
    io.emit(Data.receiverId, callData);
  });
  socket.on("receive-call", (Data) => {
    // console.log(Data)
    socket.join(Data.chatId);
    socket.broadcast.to(Data.chatId).emit("join-callees", Data.answer);
  });

  socket.on("new-candidate", (Data) => {
    // console.log(Data)
    socket.broadcast.to(Data.chatId).emit("new-candidate", Data.candidate);
  });
  socket.on("negotiation-needed", (Data) => {
    socket.broadcast.to(Data.chatId).emit("negotiation-needed", Data.offer);
  });
  socket.on("negotiation-response", (Data) => {
    socket.broadcast.to(Data.chatId).emit("negotiation-response", Data.answer);
  });
  socket.on("close-call", (Data) => {
    // console.log(Data)
    socket.broadcast.to(Data.chatId).emit("close-call");
    // console.log(`socket, ${Data.receiverId}__call-closed`)
    io.emit(`${Data.receiverId}__call-closed`, Data.chatId);
  });

  socket.on("initiate-chat", (Data) => {
    socket.join(Data);
  });

  socket.on("send-message", async (Data) => {
    const UpdatedData = {
      sender: Data.sender,
      message: Data.message,
      chatId: Data.chatId,
      time: Date.now(),
    };
    socket.broadcast.to(Data.chatId).emit("receive-message", UpdatedData);
    await MessageModel.findOneAndUpdate(
      { _id: Data.chatId },
      {
        $push: {
          messages: [
            {
              sender: Data.sender,
              message: Data.message,
            },
          ],
        },
      }
    );
  });

  socket.on("typing", (Data) => {
    // console.log(Data)
    socket.to(Data).emit("typing");
  });
  socket.on("stopped-typing", (Data) => {
    // console.log(Data)
    socket.to(Data).emit("stopped-typing");
  });
});

server.listen(port, () => console.log(`App listening on port ${port}!`));
