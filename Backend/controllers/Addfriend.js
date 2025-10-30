const UserModel = require("../models/User");
const MessageModel = require("../models/MessageModel");
const AddFriend = async (req, res) => {
  try {
    const Data = req.body;
    const User = req.user;
    if (Data) {
      const SendReq = await UserModel.findByIdAndUpdate(
        { _id: User._id },
        { $push: { sentRequests: Data.userId } },
        { new: true }
      );
      const ReceiveReq = await UserModel.findByIdAndUpdate(
        { _id: Data.userId },
        { $push: { receivedRequests: User._id } },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Friend request sent successfully",
        req: SendReq,
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};
const CancelFriend = async (req, res) => {
  try {
    const Data = req.body;
    const User = req.user;
    if (Data) {
      const cancleReq = await UserModel.findByIdAndUpdate(
        { _id: User._id },
        { $pull: { sentRequests: Data.userId } },
        { new: true }
      );
      await UserModel.findByIdAndUpdate(
        { _id: Data.userId },
        { $pull: { receivedRequests: User._id } },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Friend request cancelled successfully",
        req: cancleReq,
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};
const DeleteFriend = async (req, res) => {
  try {
    const Data = req.body;
    const User = req.user;
    if (Data) {
      const cancleReq = await UserModel.findByIdAndUpdate(
        { _id: User._id },
        { $pull: { friends: Data.userId } },
        { new: true }
      );
      await UserModel.findByIdAndUpdate(
        { _id: Data.userId },
        { $pull: { friends: User._id } },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Friend deleted successfully",
        req: cancleReq,
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};
const AcceptFriend = async (req, res) => {
  try {
    const Data = req.body;
    const User = req.user;
    if (User) {
      const Data = req.body;
      const AcceptedUser = await UserModel.findByIdAndUpdate(
        { _id: User._id },
        {
          $push: { friends: Data.userId },
          $pull: { sentRequests: Data.userId, receivedRequests: Data.userId },
        },
        { new: true }
      );
      const FriendUser = await UserModel.findByIdAndUpdate(
        { _id: Data.userId },
        {
          $push: { friends: User._id },
          $pull: { receivedRequests: User._id, sentRequests: User._id },
        },
        { new: true }
      ).select("-password");
      const NewChat = await MessageModel.create({
        users: [User._id, Data.userId],
      });
      res.status(200).json({
        success: true,
        message: "Friend request accepted successfully",
        user: FriendUser,
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};

module.exports = { AddFriend, AcceptFriend, CancelFriend, DeleteFriend };
