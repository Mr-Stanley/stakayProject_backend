module.exports = (err, req, res, next) => {
    console.error(err.stack);
  
    // Handle Paystack-specific errors
    if (err.response && err.response.data) {
      return res.status(err.response.status || 500).json({
        status: 'error',
        message: err.response.data.message || 'Paystack API error',
      });
    }
  
    // Handle generic errors
    res.status(err.status || 500).json({
      status: 'error',
      message: err.message || 'Internal Server Error',
    });
  };