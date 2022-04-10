import mongoose from "mongoose";

const { Schema } = mongoose;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: false
    },
    desc: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: true
    },
    categories: {
        type: Array,
        required: false
    },
    _destroy: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Post = mongoose.model('Post', PostSchema)

export default Post