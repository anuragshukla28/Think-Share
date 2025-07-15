import { User } from "../models/user_models.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"

// Helper: Send tokens in response
const sendToken = async (user, res, statusCode = 200) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",       // ✅ secure only in prod
    sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",  // ✅ lax in dev
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  });

  return res.status(statusCode).json(
    new ApiResponse(statusCode, {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        instagram: user.instagram,
        linkedin: user.linkedin,
        bio: user.bio,
      },
      accessToken,
    }, "Authentication successful")
  );
};

// ✅ Register
export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, avatar, instagram, linkedin, bio } = req.body;
  const avatarLocalPath = req.file?.path;

  if (!fullName || !email || !password || !avatarLocalPath) {
    throw new ApiError("Full name, email,  password,and profile picture are required", 400);
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "Email already registered");
  }

  const avatarCloud = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarCloud?.url) {
    throw new ApiError(500, "Avatar upload failed");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: avatarCloud.url, // ✅ use cloudinary URL here
    instagram,
    linkedin,
    bio,
  });
  await sendToken(user, res, 201);
});

// ✅ Login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError("Email and password are required", 400);
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError("Invalid email or password", 401);
  }

  await sendToken(user, res, 200);
});

// ✅ Refresh Access Token
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new ApiError("No refresh token found", 401);

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== token) {
      throw new ApiError("Invalid refresh token", 403);
    }

    const accessToken = user.generateAccessToken();
    return res.status(200).json(new ApiResponse(200, { accessToken }, "Access token refreshed"));
  } catch (err) {
    throw new ApiError("Refresh token expired or invalid", 403);
  }
});

// ✅ Logout
export const logoutUser = asyncHandler(async (req, res) => {
  
  const token = req.cookies?.refreshToken;

  if (!token) {
    
    return res.status(200).json(new ApiResponse(200, null, "Already logged out"));
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);
    if (user) {
      user.refreshToken = null;
      await user.save({ validateBeforeSave: false });
    }
  } catch (err) {
    console.error("Logout error:", err.message); // ✅ log the real reason
    throw new ApiError(500, "Logout failed internally");
  }
  

  res.clearCookie("refreshToken");
  return res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});

// update userAvatar
export const updateUserAvatar = asyncHandler(async (req,res)=>{
    const avatarLocalPath= req.file?.path
   
    if(!avatarLocalPath){
     throw new ApiError(400,"File is required");
    }
    const avatar=await uploadOnCloudinary(avatarLocalPath)
   
    if(!avatar.url){
     throw new ApiError(400,"Something Went Wrong while uploading avatar");
    }
   
    const user = await User.findByIdAndUpdate(
     req?.user._id,
     {
       $set:{
         avatar:avatar.url
       }
     },{
       new:true
     }
    ).select("-password -refreshToken")
   
    res.status(200).json(new ApiResponse(200,user,"Avatar updated Successfully"))
   
   
   })

   // update Profile
   export const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { bio, instagram, linkedin } = req.body;
  
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { bio, instagram, linkedin },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");
  
    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Profile updated"));
  });
  