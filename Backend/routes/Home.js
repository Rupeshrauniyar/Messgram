const Home = require('../controllers/Home')
const express = require('express')
const Router = express.Router()
const Authenticate = require('../middlewares/Authenticate')

Router.get("/home", Authenticate, Home)

module.exports = Router