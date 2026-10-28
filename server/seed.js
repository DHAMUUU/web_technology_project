require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Notice = require('./models/Notice');

const demoNotices = [
  ['Semester registration opens Monday','Complete course registration through the student portal before the deadline.','Academic','High',true],
  ['Midterm examination timetable','The midterm timetable is available from the department office.','Exam','High',false],
  ['Campus science fair','Register your project team by Friday to take part in the annual science fair.','Event','Normal',true],
  ['Library hours during break','The library will close at 4:00 PM during the mid-semester break.','General','Low',false],
  ['Public holiday closure','Campus offices will be closed for the national holiday.','Holiday','Normal',false],
  ['Assignment submission reminder','Submit your web technology assignment through the course portal.','Academic','High',false],
  ['Guest lecture: careers in technology','Join us in the main auditorium on Thursday at 2:00 PM.','Event','Normal',false],
  ['Exam hall seating plan','Check your seat number on the department notice outside the exam hall.','Exam','High',false],
  ['Sports day registrations','Sign up with the sports committee to participate in campus sports day.','Event','Low',false],
  ['Student feedback survey','Share feedback on this semester’s courses using the student portal.','General','Normal',false]
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const accounts = [
    { name: 'Campus Admin', email: 'admin@example.com', password: 'Admin@123', role: 'admin' },
    { name: 'Aarav Shah', email: 'aarav@example.com', password: 'User@1234', role: 'user' },
    { name: 'Maya Patel', email: 'maya@example.com', password: 'User@1234', role: 'user' }
  ];
  const users = [];
  for (const account of accounts) {
    let user = await User.findOne({ email: account.email });
    if (!user) user = await User.create({ ...account, password: await bcrypt.hash(account.password, 12) });
    users.push(user);
  }
  if (await Notice.countDocuments() === 0) {
    await Notice.insertMany(demoNotices.map((notice, index) => ({ title: notice[0], description: notice[1], category: notice[2], priority: notice[3], isPinned: notice[4], postedBy: users[index % users.length] })));
  }
  console.log('Safe seed complete. Existing accounts and notices were preserved.');
  await mongoose.disconnect();
}
seed().catch(error => { console.error(error.message); mongoose.disconnect().finally(() => process.exit(1)); });
