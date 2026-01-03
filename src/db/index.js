import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

//always use async await for connecting DB
const ConnectDB=async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME }`)
        console.log("Mongo DB Connected \n")
    } catch (error) {
        console.error("MONGO DB CONNETION Error",error);
        process.exit(1)
    }
}

export default ConnectDB;