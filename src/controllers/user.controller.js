import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.models.js";
import  {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser=asyncHandler(async (req,res)=>{
//get details from user
// validation –not empty
//check if user is already registered:username and email 
//check for images, check for avatar and upload them on cloudinary
//check on cloudinary that it is uploaded or not
// create user object -create entry in db
//remove password and refresh token from response
//check for user created or not not
// if yes-return response    else- return error

const {fullname,email,password,username}=req.body
console.log("email",email);

if( [fullname, email, password, username].some((field)=>filed?.trim()=="")){  //check empty validation
    throw new ApiError(400,"Allfields are required");
}

//check already  existed user

const existedUser =User.findOne({ $or:[{email}, {username}] })

if(existedUser){
    throw new ApiError(409,"User with email or username  alreay registered");
}

//path check
 const avatarLocalPath= req.files?.avatar[0]?.path;
 const coverImageLocalPath= req.files?.coverImage[0]?.path;

 if(!avatarLocalPath){
    throw new ApiError(400,"Avatar is required");
 }

 //upload on cloudinary

 const avatar= await uploadOnCloudinary(avatarLocalPath);
 const coverImage= await uploadOnCloudinary(coverImageLocalPath);

 if(!avatar){
    throw new ApiError(400,"Avatar is required")
 }


 //creating object user
 const user=await User.create({
     
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    username:username.toLowerCase(),
    email,
    password,
 })

 const createdUser =await User.findById(user._id).select("-password -refreshToken")

 if(!createdUser){
    throw new ApiError(500,"Sonething went wrong while register")
 }

 // return response
 return res.status(201).json(
    new ApiResponse(200,createdUser,"Registered successfully")
 )

});

export {registerUser}