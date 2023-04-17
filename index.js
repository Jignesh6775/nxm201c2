const express = require("express")
const {connection} = require("./db")
require("dotenv").config()
const {userRouter} = require("./routes/user.routes")
const {blogRouter} = require("./routes/blog.routes")
const {auth} = require ("./middleware/auth.middleware")


const app = express()

app.use(express.json())

/////////
app.use("users", userRouter)

app.use(auth)
app.use("blogs", blogRouter)

app.listen(process.env.port, async()=>{
    try {
        await connection
        console.log("COnnected To MongoDB")
    } catch (error) {
        console.log("Not Connected")
        console.log(error)
    }
    console.log("Server is running")
})