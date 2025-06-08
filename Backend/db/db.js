const mongoose = require('mongoose')
require("dotenv").config()


const DB = async () => {

    try {
        await mongoose.connect(process.env.MONGODB, ).then(function () {
            console.log("Successfully connected to MongoDB!")
        })

    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`)
        process.exit(1)
    }
}
module.exports = DB