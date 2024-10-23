const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: Date.now
    },
});

const Task = mongoose.model('Chat', chatSchema);

module.exports = Task;