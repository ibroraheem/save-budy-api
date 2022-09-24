const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        default: 'admin'
    },
    resetToken: {
        type: String,
        required: false
    },
},
    { timestamps: true }
)

const Admin = mongoose.model('Admin', AdminSchema)

module.exports = Admin