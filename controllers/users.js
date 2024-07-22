import User from "../models/User.js";

export const getallFriends = async (req, res) => {
  const loginUserId = req.params.loginuser_id;
 
  try {
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.limit);
    const skip= (page-1)*size;
    const totalusers = await User.countDocuments({ _id: { $ne: loginUserId } });
    const allfriends = await User.find({ _id: { $ne: loginUserId } }).skip(skip).limit(size).select("-password");
    
    res
      .status(200)
      .json({
        success: true,
        message: "All friends retrieved successfully!",
        allfriends: allfriends,
        totalusers:totalusers
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
