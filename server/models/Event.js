const mongoose = require('mongoose');

const coordinatorSchema = new mongoose.Schema({
  name:        { type: String, trim: true },
  email:       { type: String, trim: true },
  contact:     { type: String, trim: true },
  designation: { type: String, trim: true },
}, { _id: false });

const resourcePersonSchema = new mongoose.Schema({
  name:          { type: String, trim: true },
  qualification: { type: String, trim: true },
  experience:    { type: String, trim: true },
  designation:   { type: String, trim: true },
  institute:     { type: String, trim: true },
  department:    { type: String, trim: true },
}, { _id: false });

const eventSchema = new mongoose.Schema(
  {
    // Common fields
    type:       { type: String, enum: ['Event', 'MoU', 'News'], required: true },
    title:      { type: String, required: true, trim: true },
    department: { type: String, trim: true },
    status:     { type: String, enum: ['Draft', 'Pending', 'Approved', 'Published'], default: 'Draft' },
    date:       { type: String, trim: true },
    description:{ type: String, trim: true },
    images:     [{ id: String, url: String, name: String }],
    tags:       [{ type: String }],

    // ── EVENT specific ──────────────────────────────────────────────────────
    eventId:           { type: String, trim: true },
    eventType:         { type: String, trim: true },
    collaborationDept: { type: String, trim: true },
    resourcePersons:   [resourcePersonSchema],
    fromDate:          { type: String, trim: true },
    toDate:            { type: String, trim: true },
    mode:              { type: String, enum: ['Online', 'Offline', 'Hybrid'], default: 'Offline' },
    venue:             { type: String, trim: true },
    address:           { type: String, trim: true },
    duration:          { type: String, trim: true },
    registrationLink:  { type: String, trim: true },
    outcome:           { type: String, trim: true },
    participantTypes:  [{ type: String }],
    gradLevels:        [{ type: String }],
    studentYears:      [{ type: String }],
    semesters:         [{ type: String }],
    totalRegistered:   { type: String, trim: true },
    totalAttended:     { type: String, trim: true },
    coordinators:      [coordinatorSchema],
    poster:            { type: String, default: null },
    geoPhotos:         [{ id: String, url: String, name: String }],
    approvedBudget:    { type: String, trim: true },
    expenditure:       { type: String, trim: true },
    feedbackLink:      { type: String, trim: true },
    sponsorOrg:        { type: String, trim: true },
    sponsorAmount:     { type: String, trim: true },

    // ── MoU specific ────────────────────────────────────────────────────────
    mouId:                { type: String, trim: true },
    organization:         { type: String, trim: true },
    partnerOrg:           { type: String, trim: true },
    orgType:              { type: String, trim: true },
    country:              { type: String, trim: true },
    mouCategory:          { type: String, trim: true },
    startDate:            { type: String, trim: true },
    endDate:              { type: String, trim: true },
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
    documentUrl:          { type: String, default: null },

    // ── News specific ────────────────────────────────────────────────────────
    newsId:      { type: String, trim: true },
    category:    { type: String, trim: true },
    summary:     { type: String, trim: true },
    fullContent: { type: String, trim: true },
    coverImage:  { type: String, default: null },
    gallery:     [{ id: String, url: String, name: String }],
    featured:    { type: String, trim: true },
    visibility:  { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
