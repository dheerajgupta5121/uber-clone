const userModel = require('../Models/userModel');


module.exports.createUser = async ({
    firstname, lastname, email, password,phoneNumber
}) => {
    if (!firstname || !email || !password || !lastname || !phoneNumber) {
        throw new Error('All fields are required');
    }
    const user = userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        phoneNumber
    })

    return user;
}