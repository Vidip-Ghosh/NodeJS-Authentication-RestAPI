const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type : String,
        required: true,
    },
    mobile: {
        type:String,
        required: true
    },
    password: {
        type:String,
        required: true
    },
    is_verified: {
        type:Number,
        default: 0
    },
    image: {
        type:String,
        required: true
    }
})

const collection = mongoose.model('collection',userSchema);
module.exports = collection