import ConnectDB from "./db/index.js"
import dotenv from "dotenv"

//without this you cant use import dotenv 
dotenv.config({
    path:'./.env'
});

ConnectDB()

