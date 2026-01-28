const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const aiService = require('./services/aiService');

// Mock Data
const userMessage = "What is the best way to optimize listing titles?";
const history = [
    { role: 'user', content: 'Hi' },
    { role: 'assistant', content: 'Hello! I am your Amazon trainer.' }
];
const context = {
    helium10Data: ["Keyword: Garlic Press, Volume: 5000"]
};

console.log("Testing AI Service Chat...");
console.log("API Key present:", !!process.env.GEMINI_API_KEY);

async function testChat() {
    try {
        const response = await aiService.chatWithAI(userMessage, history, context);
        console.log("--------------------------------");
        console.log("AI Response:", response);
        console.log("--------------------------------");
        console.log("SUCCESS");
    } catch (error) {
        console.error("FAILED:");
        console.error(error);
    }
}

testChat();
