const express = require('express');
require('dotenv').config();
const connect_db = require('./config/database.js'); 


const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 8000; 

app.use(express.json());

app.use('/api/user', userRoutes);

async function startServer() {
  try {
    await connect_db();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
}

startServer();