import mongoose from "mongoose";

const conversationData = new mongoose.Schema(
  {
    
   messages_id:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    default:[],
  }],
  participants_id:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
   
  }]
 }, { timestamps: true });


export default mongoose.model("Conversation", conversationData);
