module.exports = (req, res, next) => {
    res.status(404).json({
      status: 'error',
      message: `Paystack resource not found: ${req.originalUrl}`,
    });
  };