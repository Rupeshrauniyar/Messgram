const { Signup, Signin } = require('../controllers/Auth')
const express = require('express')
const Router = express.Router()
const Authenticate = require('../middlewares/Authenticate')
Router.post("/signin", Signin)
Router.post("/signup", Signup)
Router.get("/authenticate", Authenticate)

module.exports = Router