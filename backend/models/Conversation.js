const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
     text: {
          type: String,
          default: ""
     },
     imageUrl: {
          type: String,
          default: "",
     },
     videoUrl: {
          type: String,
          default: "",
     },
     seen: {
          type: Boolean,
          default: false
     },
     msgByUserId: {
          type: mongoose.Schema.ObjectId,
          required: true,
          ref: "Users",
     }
}, {
     timestamps: true
})


const conversationSchema = new mongoose.Schema({
     sender: {
          type: mongoose.Schema.ObjectId,
          required: true,
          ref: "Users",
     },
     receiver: {
          type: mongoose.Schema.ObjectId,
          required: true,
          ref: "Users",
     },
     message: [
          {
               type: mongoose.Schema.ObjectId,
               ref: "Message",
          }
     ]
}, {
     timestamps: true
})

const Message = new mongoose.model("Message", messageSchema)
const Conversation = new mongoose.model("Conversation", conversationSchema)

module.exports = {
     Message,
     Conversation
}