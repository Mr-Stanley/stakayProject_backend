const express = require('express');
require('dotenv').config();
const connect_db = require('./config/database.js'); 
const {createAdmin} = require("./utils/createAdmin");





const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const donationRoutes = require('./routes/donationRoutes');
const charityRoutes = require('./routes/charityRoutes');


const app = express();
const PORT = process.env.PORT || 8000; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/charities', charityRoutes);

async function startServer() {
  try {
    await connect_db();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
}
createAdmin();
startServer();

