
const express = require('express')
const Router = express.Router()
const Authenticate = require('../middlewares/Authenticate')
const Search = require("../controllers/Search")

Router.post("/search-users", Authenticate, Search)

module.exports = Router