const { AddFriend, AcceptFriend } = require('../controllers/Addfriend')
const express = require('express')
const Router = express.Router()
const Authenticate = require('../middlewares/Authenticate')

Router.post("/add-friend", Authenticate, AddFriend)
Router.post("/accept-friend", Authenticate, AcceptFriend)


module.exports = Router