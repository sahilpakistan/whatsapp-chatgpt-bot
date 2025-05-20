require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const mongoose = require('mongoose');
const qrcode = require('qrcode-terminal');
const { getSession, saveSession, resetSession } = require('./sessions/sessionManager');
const { getChatReply } = require('./utils/openai');

// === Bot Control ===
const BOT_OWNER = '923496049312@c.us'; // <<== Your number set here
let botActive = false;

const client = new Client({
    authStrategy: new LocalAuth()
});

// === MongoDB Connect ===
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// === QR Code Display ===
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// === Bot Ready Message ===
client.on('ready', () => {
    console.log('WhatsApp bot is ready!');
});

// === Main Bot Message Handler ===
client.on('message', async msg => {
    const contactId = msg.from;

    // === Bot Control Commands (Only Owner) ===
    if (msg.body.toLowerCase() === 'sahil bot on' && contactId === BOT_OWNER) {
        botActive = true;
        return msg.reply('Bot has been activated.');
    }

    if (msg.body.toLowerCase() === 'sahil bot off' && contactId === BOT_OWNER) {
        botActive = false;
        return msg.reply('Bot has been deactivated.');
    }

    // === Ignore All Messages if Bot is Off ===
    if (!botActive) return;

    // === Chat Flow Logic ===
    let session = await getSession(contactId);
    if (!session) {
        session = { history: [] };
        await saveSession(contactId, session.history);
    }

    session.history.push({ role: 'user', content: msg.body });
    const reply = await getChatReply(session.history);
    session.history.push({ role: 'assistant', content: reply });
    await saveSession(contactId, session.history);
    msg.reply(reply);
});

// === Start Bot ===
client.initialize();
