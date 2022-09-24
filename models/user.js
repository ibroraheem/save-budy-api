const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
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
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    resetToken: {
        type: String,
        required: false,
        default: null
    },
    verificationToken: {
        type: String,
        required: false,
        default: null
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },


},
    { timestamps: true }
)