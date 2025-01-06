
const { Conversation, Message } = require("../models/Conversation");

const getCoversation = async (currentUserId) => {
     if (currentUserId) {

          const currentUserConversation = await Conversation.find({
               "$or": [
                    { sender: currentUserId },
                    { receiver: currentUserId }
               ]

          }).sort({ updatedAt: -1 }).populate("message").populate("sender").populate("receiver")

          const conversation = currentUserConversation.map((conv) => {
               const CountUnSeenMsg = conv.message.reduce((prev, curr) => {
                    
                    const msgByUserId = curr?.msgByUserId.toString();

                    if (msgByUserId !== currentUserId) {
                         return prev + (curr.seen ? 0 : 1)
                    }else{
                         return prev;
                    }
               }, 0);
               return {
                    _id: conv?._id,
                    sender: conv?.sender,
                    receiver: conv?.receiver,
                    unseenMsg: CountUnSeenMsg,
                    lastMsg: conv?.message[conv?.message.length - 1]
               }
          })

          return conversation;

     } else {
          return [];
     }
}

module.exports = getCoversation;