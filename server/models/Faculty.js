const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    email:         { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash:  { type: String, default: null },
    department:    { type: String, trim: true },
    designation:   { type: String, trim: true },
    qualification: { type: String, trim: true },
    role:          { type: String, enum: ['FACULTY', 'HOD', 'ADMIN'], default: 'FACULTY' },
    avatar:        { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Faculty', facultySchema);
