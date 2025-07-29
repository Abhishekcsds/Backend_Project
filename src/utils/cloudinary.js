import { v2 as cloudinary } from 'cloudinary';

import fs from "fs";

    // Configuration
    cloudinary.config({ 
        cloud_name: 'process.env.CLOUDINARY_CLOUD_NAME', 
        api_key: 'process.env.CLOUDINARY_API_KEY', 
        api_secret: 'process.env.CLOUDINARY_API_SECRET' // Click 'View API Keys' above to copy your API secret
    });

    //upload on cloudianary from local server 
    const uploadOnCloudinary = async (localFilePath)=>{

        try {
            
            if(!localFilePath)return null

            //upload
            const response=await cloudianary.uploader.upload(localFilePath,{
                resource_type:"auto"
            });

            //file uploaded
            console.log("Uploaded successfully",response.url)
            return response

        } catch (error) {
            fs.unlinkSync(localFilePath)// remove locally saved file as upload operation is failed
            return null
        }
   }

   export {uploadOnCloudinary}