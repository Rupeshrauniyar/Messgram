const UserModel = require('../models/User.js')
const Search = async (req, res) => {
    try {
        const Data = req.body
        if (Data) {
            const User = await UserModel.find({ username: { $regex: Data.username, $options: "i" } })
            if (User) {
                res.status(200).json({ success: true, message: 'User found', user: User })
            } else {
                res.status(200).json({ success: false, message: 'User not found' })
            }
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }

}


module.exports = Search;