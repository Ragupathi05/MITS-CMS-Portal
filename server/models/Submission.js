const mongoose = require('mongoose');

// ── Event content sub-schema ─────────────────────────────────────────────────
const resourcePersonSchema = new mongoose.Schema({
  name:          { type: String, trim: true },
  qualification: { type: String, trim: true },
  experience:    { type: String, trim: true },
  designation:   { type: String, trim: true },
  institute:     { type: String, trim: true },
  department:    { type: String, trim: true },
}, { _id: false });

const coordinatorSchema = new mongoose.Schema({
  name:        { type: String, trim: true },
  email:       { type: String, trim: true },
  contact:     { type: String, trim: true },
  designation: { type: String, trim: true },
}, { _id: false });

const eventContentSchema = new mongoose.Schema({
  eventId:          { type: String, trim: true },
  title:            { type: String, trim: true },
  department:       { type: String, trim: true },
  collaborationDept:{ type: String, trim: true },
  eventType:        { type: String, trim: true },
  description:      { type: String, trim: true },
  resourcePersons:  [resourcePersonSchema],
  fromDate:         { type: String, trim: true },
  toDate:           { type: String, trim: true },
  mode:             { type: String, enum: ['Online', 'Offline', 'Hybrid'], default: 'Offline' },
  venue:            { type: String, trim: true },
  address:          { type: String, trim: true },
  duration:         { type: String, trim: true },
  registrationLink: { type: String, trim: true },
  outcome:          { type: String, trim: true },
  participantTypes: [{ type: String }],
  gradLevels:       [{ type: String }],
  studentYears:     [{ type: String }],
  semesters:        [{ type: String }],
  totalRegistered:  { type: String, trim: true },
  totalAttended:    { type: String, trim: true },
  coordinators:     [coordinatorSchema],
  poster:           { type: String, default: null },   // base64/URL
  geoPhotos:        [{ id: String, url: String, name: String }],
  approvedBudget:   { type: String, trim: true },
  expenditure:      { type: String, trim: true },
  feedbackLink:     { type: String, trim: true },
  sponsorOrg:       { type: String, trim: true },
  sponsorAmount:    { type: String, trim: true },
  images:           [{ id: String, url: String, name: String }],
  tags:             [{ type: String }],
  date:             { type: String, trim: true },
  status:           { type: String, default: 'Draft' },
}, { _id: false });

// ── MoU content sub-schema ───────────────────────────────────────────────────
const mouContentSchema = new mongoose.Schema({
  mouId:                { type: String, trim: true },
  title:                { type: String, trim: true },
  department:           { type: String, trim: true },
  partnerOrg:           { type: String, trim: true },
  orgType:              { type: String, trim: true },
  country:              { type: String, trim: true },
  mouCategory:          { type: String, trim: true },
  startDate:            { type: String, trim: true },
  endDate:              { type: String, trim: true },
  duration:             { type: String, trim: true },
  status:               { type: String, trim: true },
  renewalOption:        { type: String, trim: true },
  purpose:              { type: String, trim: true },
  scope:                { type: String, trim: true },
  objectives:           { type: String, trim: true },
  collabAreas:          [{ type: String }],
  internalCoordinators: [coordinatorSchema],
  externalCoordinators: [coordinatorSchema],
  studentBenefits:      { type: String, trim: true },
  facultyBenefits:      { type: String, trim: true },
  expectedOutcomes:     { type: String, trim: true },
  signingImages:        [{ id: String, url: String, name: String }],
  activitiesConducted:  { type: String, trim: true },
  studentsBenefited:    { type: String, trim: true },
  internshipsProvided:  { type: String, trim: true },
  jointEvents:          { type: String, trim: true },
  approvalStatus:       { type: String, trim: true },
  organization:         { type: String, trim: true },
  images:               [{ id: String, url: String, name: String }],
  date:                 { type: String, trim: true },
}, { _id: false });

// ── News content sub-schema ──────────────────────────────────────────────────
const newsContentSchema = new mongoose.Schema({
  newsId:      { type: String, trim: true },
  title:       { type: String, trim: true },
  department:  { type: String, trim: true },
  category:    { type: String, trim: true },
  date:        { type: String, trim: true },
  summary:     { type: String, trim: true },
  fullContent: { type: String, trim: true },
  description: { type: String, trim: true },
  coverImage:  { type: String, default: null },
  gallery:     [{ id: String, url: String, name: String }],
  images:      [{ id: String, url: String, name: String }],
  tags:        [{ type: String }],
  featured:    { type: String, trim: true },
  visibility:  { type: String, trim: true },
  status:      { type: String, default: 'Draft' },
}, { _id: false });

// ── Trending content sub-schema ──────────────────────────────────────────────
const trendingContentSchema = new mongoose.Schema({
  title:       { type: String, trim: true },
  reelUrl:     { type: String, trim: true },
  date:        { type: String, trim: true },
  coverImage:  { type: String, default: null },
  department:  { type: String, trim: true },
  status:      { type: String, default: 'Draft' },
}, { _id: false });

// ── Profile diff sub-schema ──────────────────────────────────────────────────
const diffSchema = new mongoose.Schema({
  added:    { type: mongoose.Schema.Types.Mixed, default: {} },
  modified: { type: mongoose.Schema.Types.Mixed, default: {} },
  deleted:  { type: mongoose.Schema.Types.Mixed, default: {} },
}, { _id: false });

// ── Main Submission Schema ───────────────────────────────────────────────────
const submissionSchema = new mongoose.Schema(
  {
    userId:     { type: String, required: true },   // faculty id string
    title:      { type: String, required: true, trim: true },
    type:       {
      type: String,
      enum: ['Profile', 'Event', 'MoU', 'News', 'Trending', 'Research', 'Patent', 'Education', 'Achievement', 'Project'],
      required: true,
    },
    status:     { type: String, enum: ['Draft', 'Pending', 'Approved', 'Rejected'], default: 'Pending' },
    department: { type: String, trim: true },

    submittedBy:  { type: String, trim: true },
    reviewedBy:   { type: String, trim: true, default: null },
    reviewDate:   { type: String, trim: true, default: null },
    comments:     [{ type: String }],

    changeDescription: { type: String, trim: true },
    superseded:        { type: Boolean, default: false },
    resubmitFromId:    { type: String, default: null },

    // Profile-specific fields
    pendingBasicInfo:  { type: mongoose.Schema.Types.Mixed, default: null },
    previousProfile:   { type: mongoose.Schema.Types.Mixed, default: null },
    updatedProfile:    { type: mongoose.Schema.Types.Mixed, default: null },
    differences:       { type: diffSchema, default: null },

    // Content-specific fields (one will be populated based on type)
    contentData: { type: mongoose.Schema.Types.Mixed, default: null },

    date:          { type: String, trim: true },
    submittedDate: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Submission', submissionSchema);
