import mongoose from "mongoose";

(async ()=>{
    try {
        await mongoose.connect(`${}`)
    } catch (error) {
        
    }
})()