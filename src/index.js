import dotenv from "dotenv";
import  connectDB  from "./db/db.js";

dotenv.config({ path: './.env' });

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
    console.log(`Databse connection failed`)
});