
const UserModel = require('../models/User.js')
const MessageModel = require('../models/MessageModel.js')

const GetChat = async (req, res) => {
    try {
        const Data = req.body
        const User = req.user
        if (Data) {
            const Chat = await MessageModel.findOne({ users: { $all: [Data.receiverId, User._id] } }).populate({
                path: 'users',
                select: '-password'
            })
            if (Chat) {
                res.status(200).json({ success: true, message: 'Chat found', chat: Chat })
            } else {
                res.status(200).json({ success: false, message: 'Chat not found' })
            }
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }

}


module.exports = GetChat;