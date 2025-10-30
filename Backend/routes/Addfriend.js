const {
  AddFriend,
  AcceptFriend,
  CancelFriend,
  DeleteFriend,
} = require("../controllers/Addfriend");
const express = require("express");
const Router = express.Router();
const Authenticate = require("../middlewares/Authenticate");

Router.post("/add-friend", Authenticate, AddFriend);
Router.post("/cancel-friend", Authenticate, CancelFriend);
Router.post("/delete-friend", Authenticate, DeleteFriend);

Router.post("/accept-friend", Authenticate, AcceptFriend);

module.exports = Router;
