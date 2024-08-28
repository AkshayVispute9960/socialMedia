import mongoose, {Schema} from 'mongoose'

const PostSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    avatar: {
        type: String, 
    },

    caption: {
        type: String,
        default: '',
    },
    
},
{
    timestamps:true
});

export const Post = mongoose.model('Post', PostSchema);
