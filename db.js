const mongoose = require("mongoose")
require("dotenv").config()

const connection = mongoose.connect(process.env.mongoURL)

module.exports = { connection }

// mongodb+srv://jignesh:vadiyatar@cluster0.ui8bqmo.mongodb.net/nxm201eval?retryWrites=true&w=majority