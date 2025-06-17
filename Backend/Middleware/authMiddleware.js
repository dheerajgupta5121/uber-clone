const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
require("dotenv").config();
const blacklistToken = require('../Models/blacklistToken');
const captainModel = require('../Models/captainModel');

exports.auth = async (req, res, next) => {
    try {
        const bodyToken = req.body?.token;
        const cookieToken = req.cookies?.token;
        const headerTokenRaw = req.header("Authorization");
        const headerToken = headerTokenRaw?.replace("Bearer ", "").trim();

        // console.log("Body Token:", bodyToken);
        // console.log("Cookie Token:", cookieToken);
        // console.log("Header Token:", headerToken);

        const token = bodyToken || cookieToken || headerToken;
        
        const isBlacklisted = await User.findOne({ token });   // why here user is used instead of blacklistToken?

        
        // Check if the token is blacklisted

        if (isBlacklisted) {

            return res.status(401).json({
                success: false,
                message: "unauthorized user, token is blacklisted"
            });     
        }

        // If no token is provided

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token Missing',
            });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decode.id);
            req.user = user;
        } catch (e) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            });
        }

        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying token"
        });
    }
};

exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];


    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, token missing' });
    }

    const isBlacklisted = await blacklistToken.findOne({ token: token });



    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized,blacklisted' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id)
        req.captain = captain;

        return next()
    } catch (err) {
        console.log(err);

        res.status(401).json({ message: 'token is invalid' });
    }
}
