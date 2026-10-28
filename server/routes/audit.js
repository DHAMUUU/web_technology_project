const router = require('express').Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const AuditLog = require('../models/AuditLog');
router.get('/', verifyToken, isAdmin, async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 30));
    const [data,total] = await Promise.all([AuditLog.find().populate('actor','name email').sort({ createdAt:-1 }).skip((page-1)*limit).limit(limit),AuditLog.countDocuments()]);
    res.json({success:true,data,pagination:{page,limit,total,pages:Math.ceil(total/limit)}});
  } catch(error){next(error);}
});
module.exports=router;
