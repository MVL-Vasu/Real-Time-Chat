const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const GetUserDetails = require("../controllers/GetUserDetais");
const Users = require("../models/Users");
const { Conversation, Message } = require("../models/Conversation");
const getCoversation = require("../controllers/GetConversation");
const upload = require('../utils/Upload');

const app = express();

const corsOptions = {
     origin: 'https://real-time-chat-frontend-lime.vercel.app', // your frontend URL
     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
     allowedHeaders: ['Content-Type', 'Authorization'], // Include all headers you're using
};

app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
     cors: {
          origin: "https://real-time-chat-95rp.vercel.app"
     }
});

const onlineUser = new Set();


io.on("connection", async (socket) => {

     const token = socket.handshake.auth.token;

     const user = await GetUserDetails(token)

     socket.join(user?._id.toString());
     onlineUser.add(user?._id?.toString());

     io.emit("onlineUser", Array.from(onlineUser));

     socket.on("message-page", async (userId) => {
          const userDetails = await Users.findById(userId).select("-password");

          const payload = {
               _id: userDetails?._id,
               name: userDetails?.name,
               avatar: userDetails?.avatar,
               email: userDetails?.email,
               online: onlineUser.has(userId),
          }

          const roomId = [user._id.toString(), userId].sort().join("_");
          socket.join(roomId);

          socket.emit('message-user', payload);


          const getCoversation = await Conversation.findOne({
               "$or": [
                    { sender: user?._id, receiver: userId },
                    { sender: userId, receiver: user?._id },
               ]
          }).populate("message").sort({ updatedAt: -1 })

          socket.emit("LoadConversation", getCoversation?.message)

     })


     socket.on("new message", async (data) => {

          console.log(data);

          let conversation = await Conversation.findOne({
               "$or": [
                    { sender: data?.sender, receiver: data?.receiver },
                    { sender: data?.receiver, receiver: data?.sender },
               ]
          })

          if (!conversation) {
               const createConversation = await Conversation({
                    sender: data?.sender,
                    receiver: data?.receiver
               })
               conversation = await createConversation.save();
          }

          const message = new Message({
               text: data.text,
               imageUrl: data.imageUrl,
               videoUrl: data.videoUrl,
               msgByUserId: data?.msgByUserId
          })

          const saveMessage = await message.save();

          const updateConversation = await Conversation.updateOne({ _id: conversation?.id }, {
               "$push": { message: saveMessage?._id }
          })

          const getCoversationMsg = await Conversation.findOne({
               "$or": [
                    { sender: data?.sender, receiver: data?.receiver },
                    { sender: data?.receiver, receiver: data?.sender },
               ]
          }).populate("message").sort({ updatedAt: -1 })

          const roomId = [data?.sender, data?.receiver].sort().join("_");
          // io.to(roomId).emit("message", getCoversationMsg?.message);

          // io.to(data?.sender,).emit("message", getCoversationMsg?.message);
          io.to(data?.receiver).emit("message", getCoversationMsg?.message, data?.sender);

          const conversationSender = await getCoversation(data?.sender);
          const conversationReceiver = await getCoversation(data?.receiver);

          io.to(data?.sender,).emit("conversation", conversationSender);
          io.to(data?.receiver).emit("conversation", conversationReceiver);


     })


     // side bar
     socket.on('sidebar', async (currentUserId) => {

          const conversation = await getCoversation(currentUserId);

          socket.emit('conversation', conversation);

     })

     socket.on("seen", async (msgByUserId) => {
          let conversation = await Conversation.findOne({
               "$or": [
                    { sender: user?._id, receiver: msgByUserId },
                    { sender: msgByUserId, receiver: user?._id },
               ]
          })
          const conversationMessageId = conversation?.message || [];

          const updateMessage = await Message.updateMany(
               { _id: { "$in": conversationMessageId }, msgByUserId: msgByUserId },
               { "$set": { seen: true } }
          )

          const conversationSender = await getCoversation(user?._id?.toString());
          const conversationReceiver = await getCoversation(msgByUserId);

          io.to(user?._id?.toString()).emit("conversation", conversationSender);
          io.to(msgByUserId).emit("conversation", conversationReceiver);

     })


     // disconnect
     socket.on("disconnect", () => {
          onlineUser.delete(user?._id.toString());
     })
})

module.exports = { app, server };