const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator')
const mailer = require('../helpers/mailer');
const randomstring = require('randomstring')

const passwordReset = require('../models/passwordReset')

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
            msg: error.message  
        });
    }
};

const mailVerification=async(req,res)=>{
    try {
        if(req.query.id==undefined)
        {
            return res.render('404!')
        }
        const id=req.query.id;
        // const userData = await User.findOne({ _id: req.query.id });
        const userData = await User.findById(id)
        console.log("Request ID: ", id);
        console.log("User data: ",userData)
        if (userData) {
            if(userData.is_verified==1)
            {
                return res.render('mail-verification',{message: "Your mail has already been verified!!"})
            }
            console.log("Rendering with verification success message");
            await User.findByIdAndUpdate(id,{
                $set: {
                    is_verified: 1
                }
            })
            return res.render('mail-verification',{message: "Mail has been verified successfully!!"})
        } else {
            console.log("Rendering with user not found message");
            res.render('mail-verification', { message: "User not found" });
        }               
    } catch (error) {
        console.log(error);
        return res.render('404!')
    }
}

const sendMailVerification=async(req,res)=>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array() 
            });
        }
        const {email} = req.body;
        const userData=await User.findOne({email})
        if(!userData)
        {
            return res.status(400).json({
                success: false,
                msg: "Email doesn't exists!",
            });
        }
        if(userData.is_verified==1)
        {
            return res.status(400).json({
                success: false,
                msg: `${userData.email} mail is already verified`,
            });
        }

        const msg = `<p>Hii ${userData.fullname}, Please <a href="http://127.0.0.1:3000/mail-verification?id=${userData._id}">Verify</a> your mail.</p>`;
        mailer.sendMail(userData.email,"Mail verification",msg)
        return res.status(200).json({
            success: true,
            msg: 'Verification link sent to your mail, please check!',
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message 
        });
    }
}

const forgotPassword=async(req,res)=>{
    try {
        console.log("Forgot password request body: ",req.body);
        const errors = validationResult(req);
        if(!errors.isEmpty())
        {
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            })
        }
        const { email } = req.body;
        const userData = await User.findOne({email: "ghoshvidip26@gmail.com"});
        console.log("Email: ", email);
        console.log("User data: ", userData);
        if(!userData)
        {
            return res.status(400).json({
                success: false,
                msg: "Email doesn't exists!",
            });
        }
        const randomString=randomstring.generate();
        const msg = `<p>Hi ${userData.fullname}, please click <a href="http://127.0.0.1:3000/reset-password?token=${randomString}">here</a> to reset your password.</p>`;
        const PasswordReset=await passwordReset({
            user_id: userData._id,
            token: randomString
        })
        await PasswordReset.save();
        mailer.sendMail(userData.email, 'Reset Password',msg);
        return res.status(201).json({
            success: true,
            msg: 'Reset Password Link sent to your mail, please check!'
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: error.message 
        });
    }
}

const resetPassword=async(req,res)=>{
    try {
        if(req.query.token==undefined)
        {
            return res.render('404')
        }
        const resetData = await passwordReset.findOne({token: req.query.token})
        console.log(resetData);
        if(!resetData){
            return res.render('404')
        }
        return res.render('reset-password',{resetData})
        
    } catch (error) {
        return res.render('404')
    }
}

const updatePassword=async(req,res)=>{
    try {
        const {user_id,password,c_password} = req.body;
        const resetData = await passwordReset.findOne({user_id});
        if(password!=c_password)
        {
            return res.render('reset-password',{resetData,error: "Confirm Password not matching!!"})
        }
        const hashedPassword=await bcrypt.hash(c_password,10);
        await User.findByIdAndUpdate({_id: user_id},{
            $set:{
                password: hashedPassword
            }
        })
        await passwordReset.deleteMany({user_id})
        return res.redirect('/reset-success');
    } catch (error) {
        return res.render('404')
    }
}

const resetSuccess=async(req,res)=>{
    try {
        return res.render('reset-success')
    } catch (error) {
        return res.render('404')
    }
}

module.exports = { userRegister,mailVerification,sendMailVerification,forgotPassword,resetPassword,updatePassword,resetSuccess };
