const mongoose = require('mongoose');
const passwordResetSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        ref: 'collections'
    },
    token: {
        type : String,
        required: true,
    },
})

const collection = mongoose.model('passwordReset',passwordResetSchema);
module.exports = collection