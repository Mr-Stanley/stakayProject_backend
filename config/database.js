const mongoose = require('mongoose');

const connect_db = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      maxPoolSize: 10, // Allow multiple connections
      retryWrites: true, // Retry failed writes
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error; // Let caller handle
  }

  // Log connection events for debugging
  mongoose.connection.on('connected', () => console.log('Mongoose connected to MongoDB'));
  mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err.message));
  mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));
};

module.exports = connect_db;















// const mongoose = require('mongoose');

// const connect_db = async () => {
//   try {
//     console.log('Attempting to connect to MongoDB:', process.env.MONGO_URI);
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 5000, // Timeout after 5s for server selection
//     });
//     console.log('MongoDB connected');
//   } catch (error) {
//     console.error('MongoDB connection error:', error.message);
//     throw error; // Let the caller handle the error
//   }
// };

// module.exports = connect_db;