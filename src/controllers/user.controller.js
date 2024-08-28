import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"


const generateAccessAndRefreshToken = async( userId ) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler( async ( req,res ) => {
     const { firstName, lastName, email, password, role } = req.body

     if (
        [firstName, email, lastName, password,role].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

     const exitsingUser = User.findOne({ email })

     if(!exitsingUser){
        throw new ApiError(400,"user exits with this emailId")
     }

     const user = await User.create({
       firstName,
       lastName,
       email,
       password,
       role
     })

    const createUser = await User.findById(user?._id).select("-password -refreshToken")

    if(!createUser){
        throw new Error(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(201, createUser, "user created successful")
    )
})

const loginUser =  asyncHandler( async ( req, res ) => {
   const { email,password, role }  = req.body;
   const user = await User.findOne({ email })

   if(!user){
    throw new ApiResponse(404,"User does'nt exits")
   }

   const checkPassword = await user.isPasswordCurrect(password);
   
   if(!checkPassword){
    throw new ApiResponse(404, "Incurrect creadential")
   }

   const { accessToken, refreshToken }  = await generateAccessAndRefreshToken(user._id);
   
   console.log(accessToken,refreshToken)
   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

   const option = {
    httpOnly :true,
    secure: true
   }

   return res.status(201)
   .cookie("accessToken", accessToken,option)
   .cookie("refreshToken", refreshToken,option)
   .json(
    new ApiResponse(
        200,
        {
            user:loggedInUser, accessToken, refreshToken
        },
        "user logged in successfully"
    )
   )
})

const logOutUser = asyncHandler( async (req,res) => {
     await User.findByIdAndUpdate(req.user._id,{
        $unset:{
            refreshToken: 1
        }
     },{
        new: true
     })

     const option = {
        httpOnly: true,
        secure: true
     }

     return res.status(200)
     .clearCookie("accessToken", option)
     .clearCookie("refreshToekon" , option)
     .json(new ApiResponse(200, {}, "user logout"))
})

const changeCurrentPassword = asyncHandler( async( req, res ) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user?._id)
    console.log(user)
    const isPasswordCurrect = await user.isPasswordCurrect(oldPassword)

    if(!isPasswordCurrect){
        throw new ApiResponse(400,"Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave:false})

    return res.status(200).json(new ApiResponse(200,{},"password change successfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})


export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changeCurrentPassword
}