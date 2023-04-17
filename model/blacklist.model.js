const mongoose = require("mongoose")
 
const blacklistSchema = mongoose.Schema({
    accesstoken: { type: String },
    refreshtoken: { type: String },
}, {
    versionKey: false
})


const BlacklistModel = mongoose.model("blog", blacklistSchema)

module.exports = { BlacklistModel }