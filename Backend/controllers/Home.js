const home = (req, res) => {
    try {
        const user = req.user
        if (user) {
            res.status(200).json({ success: true, user });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }

}


module.exports = home;