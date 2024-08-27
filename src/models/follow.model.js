import mongoose, {Schema} from "mongoose"

const followeSchema = new Schema({
    follower: {
        type: Schema.Types.ObjectId, 
        ref: "User"
    },

    followedTo: {
        type: Schema.Types.ObjectId, 
        ref: "User"
    }
}, {timestamps: true})



export const follower = mongoose.model("follower", followeSchema)