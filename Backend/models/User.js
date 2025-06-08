const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phonenumber: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],
    receivedRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }],
    sentRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }]

})
const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;