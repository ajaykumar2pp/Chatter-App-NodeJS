require('dotenv').config()
const mongoose = require('mongoose');

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.Database_URL);
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        process.exit(1);
    }
}

module.exports = { connectMongoDB }