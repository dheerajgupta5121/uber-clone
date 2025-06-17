const Captain = require('../Models/captainModel');
const captainService = require('../Services/captainServices');
const blackListTokenModel = require('../Models/blacklistToken');
const { validationResult } = require('express-validator');


exports.registerCaptain = async (req, res) => {

    try{
         const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullName:{firstName, middleName, lastName}, email, password, phoneNumber , vehicle : {color,plate,capacity,vehicleType} } = req.body;

    const isCaptainAlreadyExist = await Captain.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exist' });
    }


    const hashedPassword = await Captain.hashPassword(password);

    const captain = await Captain.create({     // change
        fullName : {
                firstName,
                middleName,
                lastName
            },
        email,
        password: hashedPassword,
        phoneNumber,
        vehicle : {
                color,
                plate,
                capacity,
                vehicleType
            },
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });
    }catch(error){
        console.error(error);
        return res.status(500).json({
            success : false,
            message : "captain cannot created, please try again later"
        }); 
    }

}

exports.loginCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await Captain.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
}

exports.getCaptainProfile = async (req, res) => {
    res.status(200).json({ captain: req.captain });
}

exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
}



