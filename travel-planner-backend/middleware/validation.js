const validateUser = (req, res, next) => {
  const { email, username, name, surname, phone_number } = req.body;

  if (email && !isValidEmail(email)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid email format'
    });
  }

  if (phone_number && !isValidPhone(phone_number)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid phone number format'
    });
  }

  next();
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^\d{10}$/.test(phone);
}

module.exports = {
  validateUser
};