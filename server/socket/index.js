const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");
const {
  ConversationModel,
  MessageModel,
} = require("../models/ConversationModel");

const app = express();

/***socket connection */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
  },
});

/***
 * socket running at http://localhost:8080/
 */

//online user
const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("connect User ", socket.id);

  const token = socket.handshake.auth.token;

  //current user details
  const user = await getUserDetailsFromToken(token);

  //create a room
  socket.join(user?._id.toString());
  onlineUser.add(user?._id?.toString());

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    console.log("userId", userId);
    const userDetails = await UserModel.findById(userId).select("-password");

    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile: userDetails?.profile,
      online: onlineUser.has(userId),
    };
    socket.emit("user-detail", payload);

    //get previous message
    const getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    socket.emit("previous-message", getConversationMessage?.messages || []);
  });

  //new message
  socket.on("new message", async (data) => {
    try {
      //check conversation is available both user

      let conversation = await ConversationModel.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      });

      if (!conversation) {
        const createConversation = await ConversationModel.create({
          sender: data?.sender,
          receiver: data?.receiver,
        });
        //   conversation = await createConversation.save();
      }

      const saveMessage = await MessageModel.create({
        text: data.text,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        msgByUserId: data?.sender,
      });

      const updateConversation = await ConversationModel.updateOne(
        { _id: conversation?._id },
        {
          $push: { messages: saveMessage?._id },
        }
      );

      const getConversationMessage = await ConversationModel.findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      io.to(data?.sender).emit(
        "message",
        getConversationMessage?.messages || []
      );
      io.to(data?.receiver).emit(
        "message",
        getConversationMessage?.messages || []
      );

      //send conversation
      const conversationSender = await getUserConversation(data?.sender);
      const conversationReceiver = await getUserConversation(data?.receiver);

      io.to(data?.sender).emit("sidebar-list", conversationSender);
      io.to(data?.receiver).emit("sidebar-list", conversationReceiver);
    } catch (error) {
      console.log("error in message socket", error.message);
    }
  });

  //sidebar
  socket.on("sidebar", async (currentUserId) => {
    const conversation = await getUserConversation(currentUserId);
    socket.emit("sidebar-list", conversation);
  });

  socket.on("seen", async (msgByUserId) => {
    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: msgByUserId },
        { sender: msgByUserId, receiver: user?._id },
      ],
    });

    const conversationMessageId = conversation?.messages || [];

    const updateMessages = await MessageModel.updateMany(
      { _id: { $in: conversationMessageId }, msgByUserId: msgByUserId },
      { $set: { seen: true } }
    );

    //send conversation
    const sender = await getUserConversation(user?._id?.toString());
    const receiver = await getUserConversation(msgByUserId);

    io.to(user?._id?.toString()).emit("sidebar-list", sender);
    io.to(msgByUserId).emit("sidebar-list", receiver);
  });

  //disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id?.toString());
    console.log("disconnect user ", socket.id);
  });
});

const getUserConversation = async (currentUserId) => {
  return await ConversationModel.find({
    $or: [{ sender: currentUserId }, { receiver: currentUserId }],
  })
    .populate("sender")
    .populate("receiver")
    .populate("messages")
    .sort({ updatedAt: -1 });
};

module.exports = {
  app,
  server,
};
