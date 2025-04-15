const mongoose = require('mongoose');
require('dotenv').config();


const connectDatabase  = async () => {
    try {
      const connection = await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected successfully!'); 
        return connection; 
     
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  };


module .exports = connectDatabase;