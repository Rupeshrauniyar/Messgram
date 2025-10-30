const { Signup, Signin, ForgotPassword,Google } = require("../controllers/Auth");
const express = require("express");
const Router = express.Router();
const Authenticate = require("../middlewares/Authenticate");
Router.post("/signin", Signin);
Router.post("/signup", Signup);
Router.post("/google", Google);

Router.post("/forgot-password", ForgotPassword);
Router.get("/authenticate", Authenticate);

module.exports = Router;
