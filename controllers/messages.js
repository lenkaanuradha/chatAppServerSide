import Message from "../models/Message.js";
import Conversation from "../models/conversationData.js";
import { getReceiverSocketId } from "../index.js";
export const sendMessage = async (req, res) => {
  const message_body = req.body.message_body;
  const sender_id = req.params.sender_id;
  const receiver_id = req.params.receiver_id;
 
  if (!message_body) {
    res.status(401).json({ success: false, msg: "message not found!" });
  } else {
    try {
      const newMessage = new Message({
        message_body: message_body,
        senderId: sender_id,
        receiverId: receiver_id,
      });
      await newMessage.save();
      try {
        let conversation = await Conversation.findOne({
          participants_id: [sender_id, receiver_id],
        });
        if (!conversation) {
          //create new conversationtable
          conversation = new Conversation({
            participants_id: [sender_id, receiver_id],
            //by default message is an empty array
          });

          await conversation.save();
        }
       

        conversation.messages_id.push(newMessage._id);
        await conversation.save();
        const receiverSocketId=getReceiverSocketId(receiver_id);
        if(receiverSocketId){
        io.to(receiverSocketId).emit("new Message",newMessage)
        }
        res
          .status(200)
          .json({
            success: true,
            msg: "message sent successfully",
            conversationtable: conversation,
            message: newMessage,
          });
      } catch (error) {
        console.log(
          error.message,
          "error occured while saving the conversation"
        );
        res.status(500).json({ success: false, msg: "Internal server error" });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ success: false, msg: "Internal server error" });
    }
  }
};
export const getMessage = async (req, res) => {
  const sender_id = req.params.sender_id;
  const receiver_id = req.params.receiver_id;

  try {
    const [conversation1, conversation2] = await Promise.all([
      Conversation.findOne({
        participants_id: [sender_id, receiver_id]
      }).populate("messages_id"),
      Conversation.findOne({
        participants_id: [receiver_id, sender_id]
      }).populate("messages_id")
    ]);

    let messages = [];
    
    if (conversation1) {
      messages = messages.concat(conversation1.messages_id);
    }
    if (conversation2) {
      messages = messages.concat(conversation2.messages_id);
    }

    if (messages.length === 0) {
      return res.status(200).json({ success: true, messages: "No message has been sent" });
    }
    messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error", success: false });
  }
};

