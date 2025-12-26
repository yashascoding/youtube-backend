import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const ConnectDB=async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME }`)
        console.log("Mongo DB Connected \n")
    } catch (error) {
        console.error("MONGO DB CONNETION Error",error);
        throw error
    }
}

export default ConnectDB;