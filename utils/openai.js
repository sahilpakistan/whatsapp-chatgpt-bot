
const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function getChatReply(messages) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: messages,
            temperature: 0.7
        });
        return response.choices[0].message.content;
    } catch (err) {
        console.error('OpenAI error:', err);
        return "Sorry, I couldn't process your message.";
    }
}

module.exports = { getChatReply };
￼Enter
