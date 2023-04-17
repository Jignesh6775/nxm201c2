const {BlacklistModel} = require("../model/blacklist.model")

const authRole = (blacklistToken) =>{
    return  async(req, res, next) =>{
        const blacklistToken = req?.headers?.authorization

        const data= await BlacklistModel.findOne({blacklistToken})

        if(data){
            next()
        } else{
            return res.status(401).json({message: "Unauthorized Access"})
        }
    }
}

module.exports = { authRole }