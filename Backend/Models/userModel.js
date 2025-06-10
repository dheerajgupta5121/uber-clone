const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    fullName:{
        firstName:{
            type: String,
            required: true,
            minLength:[3, 'First name must be at least 3 characters long'],
        },
        middleName:{
            type: String,
            minLength:[3, 'Middle name must be at least 3 characters long'],
        },
        lastName:{
            type: String,
            required: true,
            minLength:[3, 'Last name must be at least 3 characters long'],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minLength: [6, 'Password must be at least 6 characters long'],
        select : false
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        minLength: [10, 'Phone number must be at least 10 digits long'],
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    socketId: {
        type: String,
        default: null
    },

});

userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

userSchema.methods.comparePassword = async function(password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
}

userSchema.statics.hashPassword = async function() {
    return await bcrypt.hash(this.password, 10);
}

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;