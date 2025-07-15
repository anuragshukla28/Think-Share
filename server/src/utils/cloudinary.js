import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv"

dotenv.config();


// configure cloudinary
// Required for authentication before uploading.
cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary= async (localFilePath)=>{
    try {
        if(!localFilePath)return null
  const response = await cloudinary.uploader.upload(
            localFilePath,{
                resource_type:"auto"
            }
        )
        console.log("File uploaded on cloudinary. File src: "+response.url);
        // once file is uploded , we would like to delete it from our server
        fs.unlinkSync(localFilePath)
        return response 
        
        
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}

const deleteFromCloudinary = async (publicID)=>{
try {
   const result=await cloudinary.uploader.destroy(publicID)
   console.log("Deleted from Cloudinary. Public ID",publicID);
   
    
} catch (error) {
    console.log("Error deleting from Cloudinary",error);
    return null   
}
}

export {uploadOnCloudinary,deleteFromCloudinary}