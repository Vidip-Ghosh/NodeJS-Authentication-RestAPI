const {check}=require('express-validator')

exports.registerValidator=[
    check('fullname','Name is required').not().isEmpty(),
    check('email','Please enter a valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('mobile','Mobile no should contain 10 digits').isLength({
        min: 10,
        max: 10
    }),
    check('password','Password must be greater than 6 characters, and contains at least one uppercase letter, one lowercase letter, and one number, and one special character').isStrongPassword({
        minLength: 6,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1
    }),
    check('image').custom((value, {req})=>{
        if(req.file.mimetype==='image/jpeg' || req.file.mimetype==='image/png' || req.file.mimetype==='image/jpg'){
            return true;
        }
        else 
        {
            return false;
        }
    }).withMessage("Please upload an image JPEG, PNG")
];

exports.sendMailVerificationValidator=[
    check('email','Please enter a valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
]

exports.sendPasswordResetValidator=[
    check('email','Please enter a valid email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
]