import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

const postPicture = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.files?.avatar[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const newPost = await Post.create({
        userId: req.user._id, 
        avatar: avatar.url, 
        caption: req.body.caption || '',
    });

    return res.status(201).json(
        new ApiResponse(200, newPost, "Image uploaded successfully")
    )
});


export { postPicture }