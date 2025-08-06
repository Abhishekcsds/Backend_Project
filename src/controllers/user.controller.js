import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.models.js";
import  {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";


const generateAccessAndRefreshToken=async(userId)=>{

   try {
      
      const user=await User.findOne(userId);
      const accessToken =user.generateAccessToken();
      const refreshToken=user.generateRefreshToken();
      user.refreshToken=refreshToken;

      user.save({ValidateBeforeSave:false})

      return {accessToken,refreshToken}

   } catch (error) {
      throw new ApiError(500,"Something went wrong while genrerating tokens");
   }
}

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
//console.log("email",email);

if( [fullname, email, password, username].some((field)=>field?.trim()=="")){  //check empty validation
    throw new ApiError(400,"Allfields are required");
}

//check already  existed user

const existedUser = await User.findOne({ $or:[{email}, {username}] })

if(existedUser){
    throw new ApiError(409,"User with email or username  alreay registered");
}

//path check
 const avatarLocalPath= req.files?.avatar[0]?.path;
 //const coverImageLocalPath= req.files?.coverImage[0]?.path;

 
 let coverImageLocalPath;
 if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
    coverImageLocalPath=req.files.coverImage[0].path;
 }


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



//Login Controller


const loginUser= asyncHandler(async(req,res)=>{
   //req.body--data
   //username,or email
   //find user
   //check pasword
   //access and refresh token 
   //send cookie

   const {email,username,password}=req.body;

   if(!username && !email){
      throw new ApiError(400,"username or email is required")
   }

   //finding user
  const user =await  User.findOne({
     $or:[{email},{username}]
   
   });

   if(!user ){
      throw new ApiError(400,"User does not exist");
   }

   //checking password

  const isPasswordValid=await user.isPasswordCorrect(password);

  if(!isPasswordValid){
   throw new ApiError(401,"Invalid Password");
  }

  //accress  and refresh token
 const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);

 const loggendInUser=await User.findById(user._id).select("-password -refreshToken")

 //sending cookies

 const options={
      httpOnly:true,
      secure:true
 }
 return res
 .status(201)
 .cookie("accessToken",accessToken,options)
 .cookie("refreshToken",refreshToke, options)
 .json(
   new ApiResponse(
      200,
      {
         user:loggendInUser,refreshToken,accessToken
      },

      "user loggrdIn successfully",
   )
 )
   
});


//Logout

const logoutUser = asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(
      req.user._id,
      {
         $set:{
            refreshToken:undefined
         }
      },
      {
         new:true
      }

    )

    const options={
      httpOnly:true,
      secure:true
 }

 return res
      .status(200)
      .clearCookie("accessToken",options)
      .clearCookie("refreshToken",options)
      .json(
         new ApiResponse(200,{},"user Logged Out")
      )
})


export {registerUser, loginUser,logoutUser}