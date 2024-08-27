const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    imageUrl: {
        type: String,
        required: true,
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
