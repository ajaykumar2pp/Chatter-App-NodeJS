const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const chatSchema = new Schema({
    message: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: String,
        default: Date.now
    }
},
    { timestamps: true }
);

const Task = mongoose.model('Chat', chatSchema);

module.exports = Task;