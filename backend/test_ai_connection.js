const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function listModels() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Error: GEMINI_API_KEY not found.");
            return;
        }

        console.log(`Using API Key: ${apiKey.substring(0, 10)}...`);
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        console.log(`Fetching models from ${url}...`);

        const response = await fetch(url);

        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error(text);
            return;
        }

        const data = await response.json();
        console.log("Success! Available Models:");
        const models = data.models;
        models.forEach(m => {
            // Only show models that support content generation
            if (m.supportedGenerationMethods.includes("generateContent")) {
                console.log(`- ${m.name} (${m.version})`);
            }
        });

    } catch (error) {
        console.error("Failed to list models:", error);
    }
}

listModels();
