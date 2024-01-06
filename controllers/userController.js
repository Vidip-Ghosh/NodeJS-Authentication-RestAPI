const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator')
const mailer = require('../helpers/mailer');
const userRegister = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({
                success: false,
                msg: 'Errors!!',
                errors: errors.array()
            });
        }
        const { fullname, email, mobile, password, image } = req.body;
        const isExists = await User.findOne({ email });
        console.log("User exists: ", isExists);
        console.log("Request body: ", req.body);

        if (isExists) {
            return res.status(400).json({
                success: false,
                msg: 'Email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            fullname,
            email,
            mobile,
            password: hashedPassword,
            image: 'images/' + image
        });
        
        const userData = await user.save();
        console.log("User ID: ",userData._id);
        const msg = `<p>Hii ${fullname}, Please <a href="http://127.0.0.1:3000/mail-verification?id=${userData._id}">Verify</a></p>`;
        console.log("User Registered Data: ", userData);
        mailer.sendMail(email,"Mail verification",msg)
        return res.status(200).json({
            success: true,
            msg: 'Registered successfully!',
            userData
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message  // Using error.message for a more informative error message
        });
    }
};


module.exports = { userRegister };
