
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    history: { type: Array, default: [] },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);
￼Enter
