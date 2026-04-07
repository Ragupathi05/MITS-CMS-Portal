const mongoose = require('mongoose');

const trendingSchema = new mongoose.Schema(
  {
    title:      { type: String, required: true, trim: true },
    reelUrl:    { type: String, required: true, trim: true },
    date:       { type: String, trim: true },
    coverImage: { type: String, default: null },
    department: { type: String, trim: true },
    status:     { type: String, enum: ['Draft', 'Pending', 'Published'], default: 'Draft' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trending', trendingSchema);
