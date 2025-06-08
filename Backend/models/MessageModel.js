const mongoose = require('mongoose');


const MessageSchema = mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    messages: [{
        message: {
            type: String,
            required: true,
            default: ""
        },
        time: {
            type: Date,
            default: Date.now
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    }]
})
const MessageModel = mongoose.model('messages', MessageSchema);
module.exports = MessageModel;