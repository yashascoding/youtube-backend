import ConnectDB from "./db/index.js"
import {app} from "./app.js"
import dotenv from "dotenv"

//without this you cant use import dotenv 
dotenv.config({
    path:'./.env'
});

ConnectDB().then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server running on port ${process.env.PORT || 8000}`)
    })
})
.catch((error)=>{
    console.error("Failed to start server:",error)
})

