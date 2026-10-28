const router = require('express').Router();
const { body } = require('express-validator');
const { register, login, changePassword } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const strongPassword = value => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(value);
router.post('/register', [body('name').trim().notEmpty().withMessage('Name is required'), body('email').isEmail().withMessage('Enter a valid email'), body('password').custom(strongPassword).withMessage('Password must have 8 characters, uppercase, lowercase, number and symbol'), body('role').optional().isIn(['admin', 'user'])], register);
router.post('/login', [body('email').isEmail().withMessage('Enter a valid email'), body('password').notEmpty()], login);
router.put('/change-password', verifyToken, [body('currentPassword').notEmpty(), body('newPassword').custom(strongPassword).withMessage('New password must have 8 characters, uppercase, lowercase, number and symbol')], changePassword);
module.exports = router;
