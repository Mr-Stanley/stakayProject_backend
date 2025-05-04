const express = require('express');
require('dotenv').config();
const connect_db = require('./config/database.js');
const { createAdmin } = require('./utils/createAdmin');
const cors = require('cors');
const paystackController = require('./controllers/paystackControllers.js');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/paystack-not_found');
const authMiddleware = require('./middleware/paystackAuthentication');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const donationRoutes = require('./routes/donationRoutes');
const charityRoutes = require('./routes/charityRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/charities', charityRoutes);

// Paystack Routes
app.post('/api/paystack/initialize',  paystackController.initializeTransaction);
app.get('/api/paystack/verify', paystackController.verifyTransaction);
app.post('/api/paystack/webhook', paystackController.handleWebhook);

// Not Found Middleware
app.use(notFound);

// Error Handler Middleware
app.use(errorHandler);

// Start Server
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














// const express = require('express');
// require('dotenv').config();
// const connect_db = require('./config/database.js'); 
// const {createAdmin} = require("./utils/createAdmin");
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const axios = require('axios')
// const paystackController = require('./controllers/paystackController');
// const errorHandler = require('./middleware/errorHandler');
// const notFound = require('./middleware/paystack-not_found');
// const authMiddleware = require('./middleware/paystackAuthentication');





// const userRoutes = require('./routes/userRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const donationRoutes = require('./routes/donationRoutes');
// const charityRoutes = require('./routes/charityRoutes');


// const app = express();
// const PORT = process.env.PORT || 8000; 

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
// }));
// app.use('/api/user', userRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/donations', donationRoutes);
// app.use('/api/charities', charityRoutes);


// app.post('/api/paystack/initialize', authMiddleware, paystackController.initializeTransaction);
// app.get('/api/paystack/verify', paystackController.verifyTransaction);
// app.post('/api/paystack/webhook', paystackController.handleWebhook);

// // Not Found Middleware
// app.use(notFound);

// // Error Handler Middleware
// app.use(errorHandler);

// async function startServer() {
//   try {
//     await connect_db();
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   } catch (error) {
//     console.error('Server startup failed:', error);
//     process.exit(1);
//   }
// }
// createAdmin();
// startServer();

