import dotenv from "dotenv";
import  connectDB  from "./db/db.js";
import express from 'express';
import { app } from "./app.js"; 

dotenv.config({ path: './.env' });
//const app=express();

connectDB()    // it returns promise so we use try and catch
.then(()=>{

    app.on('error',(error)=>{
        console.log("ERROR",error);
    });

    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at ${process.env.PORT}`);
    });
})
.catch((error)=>{
    console.log(`Mongo Databse connection failed`)
});