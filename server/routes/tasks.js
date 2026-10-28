const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const { verifyToken } = require('../middleware/auth');
const StudentTask = require('../models/StudentTask');

router.use(verifyToken);
const validate = req => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { const error = new Error(errors.array()[0].msg); error.status = 400; throw error; }
};

router.get('/', async (req, res, next) => {
  try {
    const tasks = await StudentTask.find({ user: req.user._id }).sort({ completedAt: 1, dueAt: 1, createdAt: -1 }).limit(200);
    res.json({ success: true, data: tasks });
  } catch (error) { next(error); }
});

router.post('/', [
  body('title').trim().isLength({ min: 1, max: 140 }).withMessage('Task title must be 1 to 140 characters.'),
  body('kind').optional().isIn(['Assignment', 'Study', 'Exam prep', 'Personal']),
  body('priority').optional().isIn(['Low', 'Medium', 'High']),
  body('dueAt').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Choose a valid due date.')
], async (req, res, next) => {
  try {
    validate(req);
    const task = await StudentTask.create({ user: req.user._id, title: req.body.title, kind: req.body.kind, priority: req.body.priority, dueAt: req.body.dueAt || null });
    res.status(201).json({ success: true, data: task });
  } catch (error) { next(error); }
});

router.patch('/:id', [body('completed').isBoolean().withMessage('Completion status must be true or false.')], async (req, res, next) => {
  try {
    validate(req);
    const task = await StudentTask.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { $set: { completedAt: req.body.completed ? new Date() : null } }, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    res.json({ success: true, data: task });
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const task = await StudentTask.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    res.json({ success: true, message: 'Task deleted.' });
  } catch (error) { next(error); }
});
module.exports = router;
