import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from '../models/Comment.model.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const commentPost = asyncHandler( async( req , res ) => {
   const userId = req.user._id;
   const { postId }   = req.params
   const { text, parentCommentId } = req.body

   if(!text){
    throw new ApiError(400,"text is required")
   }

   const newComment = await Comment.create({
    user:userId,
    post:postId,
    text:text,
    parentComment: parentCommentId || null
   })
 
   await newComment.save()

   return res.status(201).json(new ApiResponse(201,newComment,"Comment added successfully"))
})

export { commentPost } 