const User = require('../Models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklistToken = require("../Models/blacklistToken");

// register a new user

exports.register = async (req, res) => {
    try{
        const { fullName:{firstName, middleName, lastName}, email, password, phoneNumber } = req.body;
        // check if user already exists
        const existingUser = await User.find({email,phoneNumber});
        if(existingUser) {
            return res.status(400).json({ message: 'User already exists', success : false, });
        }

        // hash password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }catch(error){
            return res.status(400).json({
                success : false,
                message : "error in hashing"
            }); 
        };

        // create new user
        const user = await User.create({
           
             fullName : {
                firstName,
                middleName,
                lastName
            },
            email,password:hashedPassword,phoneNumber

        })

        return res.status(200).json({
            success : true,
            message : "user created successfully"
        }); 
        
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success : false,
            message : "user cannot created, please try again later"
        }); 
    }
};


// login user

exports.login  = async (req, res) => {
    try{
        // fetch data

        const { email, password } = req.body;
        // validate password and email
        if(!email || !password){
            return res.status(400).json({
                success : false,
                message : "email or password cannot empty"
            })
        }

        // checked for registered user

        let user = await User.findOne({ email }).select("+password");
        // if not a registerd user

        if(!user){
            return res.status(401).json({
                success : false,
                message : "please register"
            })  
        }

        // verify password and generate JWT token

        const payload = {
            email: user.email,
            id : user._id,
        }

        if( await bcrypt.compare(password , user.password)){

            // password match

            let token = jwt.sign(payload, 
                process.env.JWT_SECRET, 
                {expiresIn : "24h"}
            );


            // it insert the token into user
            user = user.toObject();
            user.token = token;

            // it hide the password 
            user.password = undefined;


            // create cookies

            let options = {
                expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 ),
                httpOnly : true,
            }

            res.cookie("token" , token , options).status(200).json({
                success : true,
                user,
                token,
                message : "user logged in succesfully"
            });
        }else{
            // password dont match

            return res.status(403).json({
                success : false,
                message : "password not matched"
            })
        }

    }catch(error){
        console.error(error);
        return res.status(500).json({
            success : false,
            message : "loggin failure"
        });
    }
}

// get user details

exports.userProfile = async (req, res) => {
    res.status(200).json(req.user);
}

exports.logout = async (req, res) => {
    res.clearCookie("token");
    const token  = req.cookies.token || req.body.token || req.header("Authorization")?.replace("Bearer ", "").trim();
    await blacklistToken.create({ token });
    return res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });
}