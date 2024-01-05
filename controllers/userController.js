const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const userRegister = async (req, res) => {
    try {
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
        console.log("User Registered Data: ", userData);

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
