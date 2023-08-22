const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, min: 3, max: 20 },
    email: { type: String, required: true, unique: true, max: 60 },
    password: { type: String, required: true, min: 6 },
    isAdmin: { type: Boolean, default: false },
    profilePicture: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);