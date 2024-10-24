const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    passowrd: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;