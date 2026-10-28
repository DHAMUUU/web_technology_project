require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Notice = require('./models/Notice');
const CampusEvent = require('./models/CampusEvent');

const day = amount => {
  const value = new Date();
  value.setHours(23, 59, 0, 0);
  value.setDate(value.getDate() + amount);
  return value;
};

const eventDate = (amount, hour = 10) => {
  const value = new Date();
  value.setDate(value.getDate() + amount);
  value.setHours(hour, 0, 0, 0);
  return value;
};

const demoNotices = [
  {
    demoKey: 'campushub-demo-technical-symposium', title: 'TECHNOVA 2026 — National Technical Symposium',
    summary: 'Demo announcement for a technology festival with robotics, coding, AI, workshops, and project exhibitions.',
    description: 'DEMO SAMPLE — TECHNOVA 2026 is an illustrative, fictional symposium announcement. A sample program includes coding challenges, a robotics showcase, introductory AI sessions, practical workshops, and student project exhibitions. This is not an official event announcement or institutional endorsement. Confirm the real organizer, date, venue, eligibility, and registration details before publishing.',
    category: 'Technical Event', priority: 'High', issuingDepartment: 'Demo · Technical Events', coverImage: '/images/demo-notices/technova-symposium.svg', imageAlt: 'Original CampusHub demo poster combining robotics, code, AI nodes, and circuit patterns', isPinned: true, expiryDate: day(30)
  },
  {
    demoKey: 'campushub-demo-hackathon', title: '24-Hour Campus Hackathon',
    summary: 'Demo invitation for student teams to build useful software solutions in a 24-hour challenge.',
    description: 'DEMO SAMPLE — This fictional hackathon invites student teams to prototype software that addresses a campus or community need. A real notice should confirm team size, eligibility, registration deadline, event schedule, venue, equipment, judging criteria, accessibility, and organizer contact. No competition or registration is currently confirmed by this sample.',
    category: 'Hackathon', priority: 'High', issuingDepartment: 'Demo · Innovation Club', coverImage: '/images/demo-notices/campus-hackathon.svg', imageAlt: 'Dark neon-blue and purple code poster for a fictional 24-hour campus hackathon', isPinned: true, expiryDate: day(18)
  },
  {
    demoKey: 'campushub-demo-ai-workshop', title: 'AI and Machine Learning Workshop',
    summary: 'Demo workshop covering machine-learning fundamentals and practical AI applications.',
    description: 'DEMO SAMPLE — This fictional beginner-friendly workshop introduces machine-learning concepts through a guided exercise and practical AI examples. A real announcement should list confirmed instructors, prerequisites, software requirements, date, venue, and registration steps. The workshop, instructor, and schedule in this example are illustrative only.',
    category: 'Workshop', priority: 'Medium', issuingDepartment: 'Demo · Computing Workshops', coverImage: '/images/demo-notices/ai-workshop.svg', imageAlt: 'Original neural-network artwork for a sample AI and machine-learning workshop', isPinned: false, expiryDate: day(22)
  },
  {
    demoKey: 'campushub-demo-exam-timetable', title: 'Semester Examination Schedule',
    summary: 'Illustrative reminder to check the verified timetable, room, reporting time, and exam guidance.',
    description: 'DEMO SAMPLE — This illustrative notice shows where an institution could share semester examination timetable information and preparation guidance. It does not contain or announce an official examination schedule. Check the institution’s approved timetable for subject codes, dates, reporting times, rooms, permitted materials, and the process for reporting a clash.',
    category: 'Examination', priority: 'High', issuingDepartment: 'Demo · Academic Office', coverImage: '/images/demo-notices/exam-notice.svg', imageAlt: 'Clean academic calendar banner for an illustrative examination notice', isPinned: true, expiryDate: day(60)
  },
  {
    demoKey: 'campushub-demo-placement-training', title: 'Campus Placement Preparation',
    summary: 'Demo preparation program for aptitude practice, coding exercises, and mock interviews.',
    description: 'DEMO SAMPLE — A fictional placement-preparation program might include timed aptitude practice, coding exercises, résumé review, and mock interviews. A real notice should state eligibility, confirmed dates, room, sign-up method, and preparation materials. This sample is not affiliated with an employer and does not promise recruitment or placement outcomes.',
    category: 'Placement', priority: 'Medium', issuingDepartment: 'Demo · Career Guidance', coverImage: '/images/demo-notices/placement-preparation.svg', imageAlt: 'Original career-development illustration for students preparing for interviews', isPinned: false, expiryDate: day(24)
  },
  {
    demoKey: 'campushub-demo-sports-tournament', title: 'Interdepartmental Sports Tournament',
    summary: 'Demo announcement for friendly department competition in football, cricket, and athletics.',
    description: 'DEMO SAMPLE — This fictional interdepartmental sports meet illustrates a sign-up announcement for football, cricket, and athletics. A real organizer would confirm sports offered, team and substitution rules, fixtures, venue, equipment, first-aid arrangements, weather plan, and registration contact. No fixtures or venue are confirmed here.',
    category: 'Sports', priority: 'Medium', issuingDepartment: 'Demo · Recreation Committee', coverImage: '/images/demo-notices/sports-tournament.svg', imageAlt: 'Energetic original football-inspired graphic for an illustrative campus sports tournament', isPinned: false, expiryDate: day(20)
  },
  {
    demoKey: 'campushub-demo-cultural-fest', title: 'Campus Cultural Fest · Demo Edition',
    summary: 'A sample program for student music, dance, theatre, and creative showcases.',
    description: 'DEMO SAMPLE — This fictional cultural festival imagines student performances, an open-mic session, a theatre showcase, and creative displays. A real notice should confirm audition and sign-up steps, rehearsal requirements, venue, accessibility details, and event timings. This sample does not describe a confirmed college event.',
    category: 'Event', priority: 'Normal', issuingDepartment: 'Demo · Student Activities', coverImage: '/images/demo-notices/cultural-fest.svg', imageAlt: 'Colorful original vector artwork for an illustrative campus arts festival', isPinned: false, expiryDate: day(35)
  },
  {
    demoKey: 'campushub-demo-internship', title: 'Student Software Internship · Example Listing',
    summary: 'A fictional internship listing format with example eligibility and application guidance.',
    description: 'DEMO SAMPLE — This fictional listing demonstrates how an internship notice might describe a software project, expected skills, weekly time commitment, mentorship format, selection stages, and application materials. No company, role, stipend, or vacancy is represented as real. Verify the source and deadline before sharing an actual opportunity.',
    category: 'Placement', priority: 'Medium', issuingDepartment: 'Demo · Career Guidance', coverImage: '/images/demo-notices/internship.svg', imageAlt: 'Original career-growth illustration for a sample student internship listing', isPinned: false, expiryDate: day(25)
  },
  {
    demoKey: 'campushub-demo-scholarship', title: 'Scholarship Application Guidance · Demo',
    summary: 'A sample checklist for verifying scholarship eligibility, documents, and submission details.',
    description: 'DEMO SAMPLE — A real scholarship announcement should link to the verified awarding body and state eligibility, conditions, required documents, submission route, and confirmed deadline. Students should verify information with the institution’s financial-aid office before sharing personal documents. This is not an active scholarship offer.',
    category: 'Academic', priority: 'High', issuingDepartment: 'Demo · Student Support', coverImage: '/images/demo-notices/scholarship.svg', imageAlt: 'Original graduation-cap artwork for a sample scholarship guidance notice', isPinned: false, expiryDate: day(28)
  },
  {
    demoKey: 'campushub-demo-guest-lecture', title: 'Emerging Technology Guest Lecture · Sample',
    summary: 'An example talk format about building reliable, responsible digital products.',
    description: 'DEMO SAMPLE — This fictional lecture explores evaluating emerging technology, designing reliable systems, and considering privacy and accessibility. No speaker is named. For a real event, confirm the speaker, biography, talk title, venue, date, recording policy, and question-submission process with the host. No real lecture is being announced.',
    category: 'Event', priority: 'Normal', issuingDepartment: 'Demo · Academic Enrichment', coverImage: '/images/demo-notices/guest-lecture.svg', imageAlt: 'Original technology-themed lecture stage illustration for a sample guest talk', isPinned: false, expiryDate: day(24)
  },
  {
    demoKey: 'campushub-demo-library-hours', title: 'Extended Library Study Hours · Sample',
    summary: 'Example exam-period update describing later closing hours and quiet study spaces.',
    description: 'DEMO SAMPLE — This example shows how the library could announce extended study hours during exam preparation. A real notice must confirm opening and closing times, entry requirements, available study rooms, borrowing rules, and any weekend service changes with library staff. This sample does not change current library access.',
    category: 'Academic', priority: 'Normal', issuingDepartment: 'Demo · Library Services', coverImage: '/images/demo-notices/library-hours.svg', imageAlt: 'Original books and reading-lamp artwork for an illustrative library-hours notice', isPinned: false, expiryDate: day(40)
  },
  {
    demoKey: 'campushub-demo-holiday', title: 'Campus Holiday Notice · Sample Template',
    summary: 'A template for communicating verified holiday dates and campus service arrangements.',
    description: 'DEMO SAMPLE — This template illustrates a holiday closure announcement. Before publishing a real notice, verify the dates and reopening time, then explain any changes to classes, library access, transport, residence services, or essential offices. This sample does not announce an actual holiday or campus closure.',
    category: 'Holiday', priority: 'Normal', issuingDepartment: 'Demo · Campus Services', coverImage: '/images/demo-notices/holiday.svg', imageAlt: 'Original campus-building illustration for a sample holiday notice', isPinned: false, expiryDate: day(45)
  },
  {
    demoKey: 'campushub-demo-project-exhibition', title: 'Student Project Exhibition · Demo',
    summary: 'Illustrative showcase announcement for student prototypes, research, and creative projects.',
    description: 'DEMO SAMPLE — This fictional exhibition invites student teams to present a prototype, research poster, or creative project and explain its process. A real notice should confirm exhibitor eligibility, display requirements, venue, setup time, judging or feedback format, and accessibility arrangements. No event is confirmed by this sample.',
    category: 'Technical Event', priority: 'Normal', issuingDepartment: 'Demo · Project Showcase', coverImage: '/images/demo-notices/project-exhibition.svg', imageAlt: 'Original exhibit-board illustration for a fictional student project exhibition', isPinned: false, expiryDate: day(32)
  },
  {
    demoKey: 'campushub-demo-club-registration', title: 'Student Club Registration Week · Sample',
    summary: 'A demo invitation to explore student communities and learn how to join.',
    description: 'DEMO SAMPLE — This fictional club fair introduces student communities for technology, arts, service, culture, and recreation. A real announcement should list participating clubs, membership requirements, meeting locations, accessibility details, and a verified contact. No registration period is confirmed here.',
    category: 'Event', priority: 'Low', issuingDepartment: 'Demo · Student Activities', coverImage: '/images/demo-notices/club-registration.svg', imageAlt: 'Original illustration of students and community circles for a sample club fair', isPinned: false, expiryDate: day(26)
  },
  {
    demoKey: 'campushub-demo-research-poster-workshop', title: 'Research Poster Design Workshop · Sample',
    summary: 'An illustrative session about organizing research findings into a clear visual story.',
    description: 'DEMO SAMPLE — This fictional workshop covers structuring a research poster, choosing readable charts, citing sources, and presenting findings to a general audience. A real notice should confirm the facilitator, required materials, venue, date, and registration process. The session and schedule here are examples only.',
    category: 'Workshop', priority: 'Medium', issuingDepartment: 'Demo · Research Skills', coverImage: '/images/demo-notices/research-poster-workshop.svg', imageAlt: 'Original research-chart poster illustration for a sample design workshop', isPinned: false, expiryDate: day(29)
  }
];

async function seed() {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required.');
  await mongoose.connect(process.env.MONGO_URI);
  const author = await User.findOne({ isActive: { $ne: false } }).sort({ role: -1, createdAt: 1 });
  if (!author) throw new Error('No active account exists. Create an account before seeding demo notices. No account was created.');

  let inserted = 0;
  for (const notice of demoNotices) {
    const result = await Notice.updateOne(
      { demoKey: notice.demoKey },
      { $set: { ...notice, postedBy: author._id, isDemo: true, status: 'published', audience: 'campus', departments: [], academicYears: [] } },
      { upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    if (result.upsertedCount) inserted += 1;
  }
  let eventsInserted = 0;
  for (const [index, noticeData] of demoNotices.entries()) {
    const notice = await Notice.findOne({ demoKey: noticeData.demoKey }).select('_id title summary category');
    if (!notice) continue;
    const startAt = eventDate(index + 1);
    const kind = notice.category === 'Examination' || notice.category === 'Exam' ? 'Exam'
      : notice.category === 'Workshop' ? 'Workshop'
      : notice.category === 'Holiday' ? 'Holiday'
      : notice.category === 'Placement' ? 'Registration'
      : ['Academic', 'General'].includes(notice.category) ? 'Other' : 'College event';
    const result = await CampusEvent.updateOne(
      { demoKey: `${noticeData.demoKey}-calendar` },
      { $set: {
        title: notice.title,
        description: `${notice.summary}\n\nDEMO SAMPLE — Illustrative calendar date only. Confirm the real date, time, venue, and organizer before relying on this example.`,
        kind,
        startAt,
        endAt: new Date(startAt.getTime() + 2 * 60 * 60 * 1000),
        notice: notice._id,
        createdBy: author._id,
        isDemo: true,
        demoKey: `${noticeData.demoKey}-calendar`,
        departments: [],
        academicYears: []
      } },
      { upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    if (result.upsertedCount) eventsInserted += 1;
  }
  console.log(`Demo notices ready: ${demoNotices.length} total, ${inserted} newly inserted. Demo calendar events ready: ${demoNotices.length} total, ${eventsInserted} newly inserted. Existing records were preserved.`);
}

seed()
  .catch(error => { console.error(`Demo seed failed: ${error.message}`); process.exitCode = 1; })
  .finally(async () => { if (mongoose.connection.readyState) await mongoose.disconnect(); });
