
const express = require('express')
const Router = express.Router()
const Authenticate = require('../middlewares/Authenticate')
const GetChat = require("../controllers/Message")

Router.post("/get-chat", Authenticate, GetChat)

module.exports = Router