import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    useremail: {
      type: String,
      required: true,
      unique: true,
    },
   profilePic: {
      type: String,
     
      
    },

    password: {
      type: String,
      required: true,
      min_length:6
    },
    is_online: {
      type: Boolean,
      default: "0",
    },
  
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
