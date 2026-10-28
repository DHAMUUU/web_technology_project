function groupAudienceConditions(user) {
  const matchGroup = (field, value) => ({ $or: [
    { [field]: { $exists: false } },
    { [field]: { $size: 0 } },
    ...(value ? [{ [field]: { $in: [value] } }] : [])
  ] });
  return { $and: [
    matchGroup('departments', user.department),
    matchGroup('academicYears', user.academicYear),
    { $expr: { $or: [
      { $gt: [{ $size: { $ifNull: ['$departments', []] } }, 0] },
      { $gt: [{ $size: { $ifNull: ['$academicYears', []] } }, 0] }
    ] } }
  ] };
}

function audienceConditions(user) {
  return { $or: [
    { audience: { $ne: 'targeted' } },
    { audience: { $exists: false } },
    { audience: 'targeted', ...groupAudienceConditions(user) }
  ] };
}

function visibleNoticeFilter(user) {
  const and = [
    { $or: [{ status: 'published' }, { status: { $exists: false } }] },
    { $or: [{ expiryDate: null }, { expiryDate: { $gte: new Date() } }] },
    audienceConditions(user)
  ];
  return { $and: and };
}

module.exports = { audienceConditions, groupAudienceConditions, visibleNoticeFilter };
