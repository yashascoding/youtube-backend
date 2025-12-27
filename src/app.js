import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


//this is for frontend and backend communication
const app=express();
app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,//allowed path 
        credentials:true   //allow cookies jwt and sessions 
    }
))

app.use(express.json({limit:"16kb"}))//this is to read json data sent from client to server but limited to 16 kb 
app.use(express.urlencoded())//this is for parsing form data
app.use(cookieParser())//reads cookies from upcoming requests 
app.use(express.static("public"))//serve static files 
export {app}