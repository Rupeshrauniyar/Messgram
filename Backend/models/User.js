const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  googleUser: {
    type: Boolean,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phonenumber: {
    type: String,
    required: false,
    unique: true,
  },
  pp: {
    type: String,
    required: false,
  },
  uuid: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  notification: [
    {
      type: {
        type: String,
        enum: ["friend_request", "message", "like", "comment"], // add more as needed
        required: true,
      },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // who triggered the notification
        required: true,
      },
      message: {
        type: String, // optional text like "John sent you a friend request"
      },
      isRead: {
        type: Boolean,
        default: false, // unread by default
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  receivedRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  sentRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});
const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
