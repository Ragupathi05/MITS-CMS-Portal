const mongoose = require('mongoose');

// ── Sub-schemas for each table section ──────────────────────────────────────

const educationSchema = new mongoose.Schema({
  course:         { type: String, trim: true },
  specialization: { type: String, trim: true },
  branch:         { type: String, trim: true },
  college:        { type: String, trim: true },
  year:           { type: String, trim: true },
}, { _id: true });

const postDoctoralSchema = new mongoose.Schema({
  institution:  { type: String, trim: true },
  researchArea: { type: String, trim: true },
  duration:     { type: String, trim: true },
  description:  { type: String, trim: true },
}, { _id: true });

const researchProfileSchema = new mongoose.Schema({
  scopusLink:        { type: String, trim: true },
  vidwanLink:        { type: String, trim: true },
  googleScholarLink: { type: String, trim: true },
  orcid:             { type: String, trim: true },
  hIndex:            { type: String, trim: true },
}, { _id: false });

const consultancyProjectSchema = new mongoose.Schema({
  title:         { type: String, trim: true },
  fundingAgency: { type: String, trim: true },
  amount:        { type: String, trim: true },
  duration:      { type: String, trim: true },
  role:          { type: String, trim: true },
  status:        { type: String, trim: true },
}, { _id: true });

const fundedProjectSchema = new mongoose.Schema({
  title:         { type: String, trim: true },
  fundingAgency: { type: String, trim: true },
  amount:        { type: String, trim: true },
  duration:      { type: String, trim: true },
  role:          { type: String, trim: true },
  status:        { type: String, trim: true },
}, { _id: true });

const patentSchema = new mongoose.Schema({
  title:        { type: String, trim: true },
  patentNumber: { type: String, trim: true },
  status:       { type: String, trim: true },
  filingDate:   { type: String, trim: true },
  grantDate:    { type: String, trim: true },
}, { _id: true });

const bookChapterSchema = new mongoose.Schema({
  title:     { type: String, trim: true },
  publisher: { type: String, trim: true },
  isbn:      { type: String, trim: true },
  year:      { type: String, trim: true },
  authors:   { type: String, trim: true },
}, { _id: true });

const awardSchema = new mongoose.Schema({
  awardName:    { type: String, trim: true },
  organization: { type: String, trim: true },
  year:         { type: String, trim: true },
  description:  { type: String, trim: true },
}, { _id: true });

const industryCollabSchema = new mongoose.Schema({
  organization: { type: String, trim: true },
  type:         { type: String, trim: true },
  duration:     { type: String, trim: true },
  outcome:      { type: String, trim: true },
}, { _id: true });

const academicExposureSchema = new mongoose.Schema({
  program:     { type: String, trim: true },
  institution: { type: String, trim: true },
  country:     { type: String, trim: true },
  year:        { type: String, trim: true },
}, { _id: true });

const eventOrganisedSchema = new mongoose.Schema({
  eventName: { type: String, trim: true },
  role:      { type: String, trim: true },
  location:  { type: String, trim: true },
  date:      { type: String, trim: true },
}, { _id: true });

const eventAttendedSchema = new mongoose.Schema({
  eventName: { type: String, trim: true },
  role:      { type: String, trim: true },
  location:  { type: String, trim: true },
  date:      { type: String, trim: true },
}, { _id: true });

const affiliationSchema = new mongoose.Schema({
  organizationName: { type: String, trim: true },
  membershipType:   { type: String, trim: true },
  duration:         { type: String, trim: true },
}, { _id: true });

const invitationSchema = new mongoose.Schema({
  eventName:    { type: String, trim: true },
  role:         { type: String, trim: true },
  organization: { type: String, trim: true },
  date:         { type: String, trim: true },
}, { _id: true });

const academicVisitSchema = new mongoose.Schema({
  institution: { type: String, trim: true },
  purpose:     { type: String, trim: true },
  duration:    { type: String, trim: true },
  outcome:     { type: String, trim: true },
}, { _id: true });

const outreachSchema = new mongoose.Schema({
  activityName: { type: String, trim: true },
  description:  { type: String, trim: true },
  location:     { type: String, trim: true },
  date:         { type: String, trim: true },
}, { _id: true });

// ── Main Profile Schema ──────────────────────────────────────────────────────

const profileSchema = new mongoose.Schema(
  {
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['Draft', 'Pending', 'Approved', 'Rejected'],
      default: 'Draft',
    },

    // Section 1 — Education
    education: [educationSchema],

    // Section 2 — Post Doctoral
    postDoctoral: [postDoctoralSchema],

    // Section 3 — Research Interest (text)
    researchInterest: { type: String, trim: true },

    // Section 4 — Research Profile (key-value)
    researchProfile: { type: researchProfileSchema, default: () => ({}) },

    // Section 5 — Research Details (text)
    researchDetails: { type: String, trim: true },

    // Section 6 — Consultancy Projects
    consultancyProjects: [consultancyProjectSchema],

    // Section 7 — Funded Projects
    fundedProjects: [fundedProjectSchema],

    // Section 8 — Patents
    patents: [patentSchema],

    // Section 9 — Books / Chapters
    booksChapters: [bookChapterSchema],

    // Section 10 — Awards & Recognition
    awardsRecognition: [awardSchema],

    // Section 11 — Industry Collaboration
    industryCollaboration: [industryCollabSchema],

    // Section 12 — Academic Exposure
    academicExposure: [academicExposureSchema],

    // Section 13 — Events Organised
    eventsOrganised: [eventOrganisedSchema],

    // Section 14 — Events Attended
    eventsAttended: [eventAttendedSchema],

    // Section 15 — Professional Affiliations
    professionalAffiliations: [affiliationSchema],

    // Section 16 — Invitations
    invitations: [invitationSchema],

    // Section 17 — Academic Visit
    academicVisit: [academicVisitSchema],

    // Section 18 — Outreach Activities
    outreachActivities: [outreachSchema],

    // Section 19 — Other Information (text)
    otherInfo: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
