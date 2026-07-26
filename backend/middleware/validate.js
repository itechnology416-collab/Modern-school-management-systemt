const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array().map(e => ({ field: e.path, message: e.msg })) });
  }
  next();
};

const loginRules = [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const registerRules = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
  body('schoolName').optional().trim().isLength({ min: 2 }),
];

const createUserRules = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('role').isIn(['teacher', 'student', 'parent']).withMessage('Invalid role'),
];

const feeRules = [
  body('feeName').trim().notEmpty().withMessage('Fee name required'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Amount must be positive'),
  body('feeType').isIn(['tuition', 'exam', 'library', 'sports', 'transport', 'hostel', 'other']).withMessage('Invalid fee type'),
];

const expenseRules = [
  body('title').trim().notEmpty().withMessage('Title required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be positive'),
  body('category').isIn(['salary', 'utilities', 'maintenance', 'supplies', 'transport', 'events', 'misc']).withMessage('Invalid category'),
];

module.exports = { validate, loginRules, registerRules, createUserRules, feeRules, expenseRules };
