import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from '../models/like.model.js'

const toggleLike = asyncHandler( async(req,res) => {
    const userId = req.user?._id;
    const { postId } = req.params;
    let newLike;
    let totalLike;

    const existingLike = await Like.findOne({ user:userId , post:postId })

    if(existingLike){
        await Like.findOneAndDelete(existingLike._id);
        return res.status(200).json(
            new ApiResponse(200, null, "post unliked successfully")
        )
    } else {
         newLike = await Like.create({
            user: userId,
            post: postId,
        })

        await newLike.save();
        totalLike = await Like.find({post:postId});
    }
   return res.status(201).json(new ApiResponse(201, totalLike.length, "post liked successfully"))
})


export { toggleLike }