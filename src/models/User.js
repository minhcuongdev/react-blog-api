import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: "",
    },
    _destroy: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)

export default User