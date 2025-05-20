
const Session = require('../models/Session');

async function getSession(userId) {
    return await Session.findOne({ userId });
}

async function saveSession(userId, history) {
    await Session.findOneAndUpdate(
        { userId },
        { userId, history, lastUpdated: new Date() },
        { upsert: true, new: true }
    );
}

async function resetSession(userId) {
    await Session.deleteOne({ userId });
}

module.exports = { getSession, saveSession, resetSession };
￼Enter
