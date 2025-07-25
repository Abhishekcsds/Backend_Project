
import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser';

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentialS:true,
}));

app.use(express.json({limit:"16kb"}));  // for form data

app.use(express.urlencoded({extended:true,limit:"16kb"})); //for url 
app.use(express.static("pubic")); // for files and folders
app.use(cookieParser());

export {app}