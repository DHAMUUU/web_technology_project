const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const User = require('../models/User');

async function audit(actor, action, entity, recordId, details = '') {
  await AuditLog.create({ actor: actor._id, action, entity, recordId, details });
}

async function notifyNotice(notice) {
  const filter = { isActive: true };
  if (notice.audience === 'targeted') {
    const and = [];
    if (notice.departments?.length) and.push({ department: { $in: notice.departments } });
    if (notice.academicYears?.length) and.push({ academicYear: { $in: notice.academicYears } });
    if (and.length) filter.$and = and;
  }
  const users = await User.find(filter).select('_id');
  if (!users.length) return;
  const urgent = notice.priority === 'High';
  const type = urgent ? 'urgent' : 'new_notice';
  await Notification.bulkWrite(users.map(user => ({ updateOne: {
    filter: { recipient: user._id, notice: notice._id, type },
    update: { $setOnInsert: { recipient: user._id, notice: notice._id, type, title: urgent ? 'Urgent campus announcement' : 'New campus notice', message: notice.title } },
    upsert: true
  } })), { ordered: false });
}

async function notifyEvent(event) {
  const filter = { isActive: true };
  const and = [];
  if (event.departments?.length) and.push({ department: { $in: event.departments } });
  if (event.academicYears?.length) and.push({ academicYear: { $in: event.academicYears } });
  if (and.length) filter.$and = and;
  const users = await User.find(filter).select('_id');
  const type = ['Exam', 'Assignment', 'Registration'].includes(event.kind) ? 'deadline' : 'event';
  await Notification.bulkWrite(users.map(user => ({ updateOne: {
    filter: { recipient: user._id, event: event._id, type },
    update: { $setOnInsert: { recipient: user._id, event: event._id, type, title: type === 'deadline' ? 'Upcoming academic deadline' : 'New campus event', message: event.title } },
    upsert: true
  } })), { ordered: false });
}

module.exports = { audit, notifyNotice, notifyEvent };
