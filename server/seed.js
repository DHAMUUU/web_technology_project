require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Notice = require('./models/Notice');
const notices = [
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
 await User.deleteMany({}); await Notice.deleteMany({});
 const password = await bcrypt.hash('Admin@123', 10);
 const [admin, user1, user2] = await User.create([
  { name: 'Campus Admin', email: 'admin@example.com', password, role: 'admin' },
  { name: 'Aarav Shah', email: 'aarav@example.com', password: await bcrypt.hash('User@1234', 10), role: 'user' },
  { name: 'Maya Patel', email: 'maya@example.com', password: await bcrypt.hash('User@1234', 10), role: 'user' }
 ]);
 const authors = [admin, user1, user2];
 await Notice.insertMany(notices.map((n, i) => ({ title: n[0], description: n[1], category: n[2], priority: n[3], isPinned: n[4], postedBy: authors[i % authors.length] })));
 console.log('Seed complete. Admin: admin@example.com / Admin@123; users: aarav@example.com or maya@example.com / User@1234');
 await mongoose.disconnect();
}
seed().catch(e => { console.error(e); process.exit(1); });
