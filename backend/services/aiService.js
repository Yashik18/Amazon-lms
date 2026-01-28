const { GoogleGenerativeAI } = require('@google/generative-ai');
const Dataset = require('../models/Dataset');
const Scenario = require('../models/Scenario');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Helper to extract keywords from message
const extractKeywords = (message) => {
    const commonWords = ['how', 'what', 'why', 'when', 'where', 'do', 'can', 'is', 'are', 'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'i', 'my', 'me'];
    return message
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(' ')
        .filter(word => !commonWords.includes(word) && word.length > 2);
};

// RAG: Get relevant context from Datasets
exports.getRelevantContext = async (message) => {
    const keywords = extractKeywords(message);
    if (keywords.length === 0) return {};

    const context = {
        piData: [],
        helium10Data: [],
        adsLibraryData: []
    };

    try {
        // Enhanced relevance search
        const explicitTypes = [];
        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes('helium') || lowerMsg.includes('keyword')) explicitTypes.push('helium10');
        if (lowerMsg.includes('pi') || lowerMsg.includes('market') || lowerMsg.includes('share')) explicitTypes.push('pi');
        if (lowerMsg.includes('ads') || lowerMsg.includes('competitor') || lowerMsg.includes('creative')) explicitTypes.push('adsLibrary');

        const query = {
            $or: [
                { category: { $in: keywords.map(k => new RegExp(k, 'i')) } },
                { 'metadata.description': { $in: keywords.map(k => new RegExp(k, 'i')) } }
            ]
        };

        // If explicit types are found, OR them into the query to ensure we capture them even if keywords don't match categories
        if (explicitTypes.length > 0) {
            query.$or.push({ type: { $in: explicitTypes } });
        }

        const datasets = await Dataset.find(query).limit(5); // Increased limit

        datasets.forEach(d => {
            if (d.type === 'pi') context.piData.push(d.data);
            if (d.type === 'helium10') context.helium10Data.push(d.data);
            if (d.type === 'adsLibrary') context.adsLibraryData.push(d.data);
        });

        return context;
    } catch (error) {
        console.error("Context retrieval error:", error);
        return {};
    }
};

// Main Chat Function
exports.chatWithAI = async (userMessage, conversationHistory, context) => {
    try {
        const history = conversationHistory.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user', // Map assistant -> model for Gemini
            parts: [{ text: msg.content }],
        }));

        const systemPrompt = `
      You are an expert Amazon selling trainer for a Learning Management System.
      Your role is to teach e-commerce executives about:
      - Amazon SEO and Listings
      - PPC Campaigns (Sponsored Products, Brands, Display)
      - Market Intelligence (using Pi data)
      - Keyword Research (using Helium 10 data)
      - Competitor Analysis (using Amazon Ads Library)

      Available Data Context:
      ${JSON.stringify(context, null, 2)}

      Instructions:
      1. **CRITICAL: CONTEXT RELEVANCE CHECK**
         - The 'Available Data Context' provided below might be for a DIFFERENT product than what the user is asking about.
         - **STEP 1**: Identify the User's Product (e.g., "Children Toys").
         - **STEP 2**: Identify the Context Product (e.g., "Resistance Bands").
         - **STEP 3**: IF THEY DO NOT MATCH, YOU **MUST** IGNORE THE CONTEXT ENTIRELY.
           - Do **NOT** say "I do not have data".
           - Do **NOT** say "However, I can show you data for [Context Product]".
           - **INSTEAD**: Answer the user's question directly using your internal general knowledge as if no context was provided.

      2. **Answering Rule**:
         - If Context is Relevant: Use it to provide specific data tables and analysis.
         - If Context is Irrelevant/Missing: Generate a **theoretical** answer based on general Amazon best practices. Create a table of legitimate *example* keywords/metrics based on your training data.

      3. **Response Structure**:
         - **Concept**: Brief explanation.
         - **Data Analysis**: The table/data (Real or General Knowledge per above rules).
         - **Action Steps**: 3-5 concrete things to do.
         - **Example**: A short scenario.

      4. **Disclaimer**:
         - If using General Knowledge, add a small note: *"Note: Generated based on general market knowledge as specific account data was not found."*
    `;

        const chat = model.startChat({
            history: [
                { role: 'user', parts: [{ text: systemPrompt }] }, // Seed system prompt as first message
                { role: 'model', parts: [{ text: "Understood. I am ready to act as the Amazon expert trainer." }] },
                ...history
            ],
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("AI Chat Error:", error);
        throw error; // Rethrow original error to allow controller to handle 429s
    }
};

// Evaluate Scenario Answer
exports.evaluateScenarioAnswer = async (scenario, userAnswer) => {
    try {
        // Handle both old (single question) and new (multi-question) schema
        const questionsText = scenario.questions
            ? scenario.questions.map((q, i) => `Q${i + 1}: ${q.text} (Correct: ${q.options.find(o => o.isCorrect)?.text})`).join('\n')
            : `Question: ${scenario.question}\nCorrect Answer: ${scenario.options.find(o => o.isCorrect)?.text}`;

        const prompt = `
      You are grading a student's answer to an Amazon business scenario.

      **Scenario**: ${scenario.description}
      **Context**: ${JSON.stringify(scenario.context)}
      
      **Assessment Questions & Correct Answers**:
      ${questionsText}

      **Ideal Answer / Key Concepts**: ${scenario.idealAnswer}

      **Student's Submitted Answers**: 
      "${userAnswer}"

      Evaluate the student on:
      1. Correctness (0-10) - Did they choose the right options?
      2. Data Understanding (0-5) - Did they use the context?
      3. Reasoning (0-5) - Does their choice make sense?
      4. Actionability (0-5) - Is it a good business decision?

      Return a JSON object ONLY (no markdown):
      {
        "score": number, // Total out of 25. Scale this to 100 on frontend if needed, or return raw. 
                         // WAIT, user wants /100. Let's return a score out of 100 directly.
        "isCorrect": boolean, // Pass if score > 70
        "feedback": "string", // Detailed feedback on which questions were right/wrong
        "breakdown": {
          "correctness": number, // out of 40
          "dataUnderstanding": number, // out of 20
          "reasoning": number, // out of 20
          "actionability": number // out of 20
        }
      }
      
      IMPORTANT SCORING RULES:
      1. **PERFECT SCORE (100)**: If the student selects ALL correct options for ALL questions, the score MUST be 100.
      2. **ZERO SCORE (0)**: If the student selects ANY incorrect option for a single-question scenario, or fails >50% of a multi-question scenario, strict penalty applies.
      3. **CRITICAL OVERRIDE**: If the student's core decision (the option selected) is WRONG, the Total Score MUST be 0. **Do not give partial credit for "reasoning" or "data understanding" if the answer is factually wrong.**
      4. **PARTIAL SCORE**: Only applicable for multi-question scenarios where the user gets SOME questions entirely correct (e.g., 1 out of 2 questions correct = 50).
      5. **FEEDBACK**: Explain exactly which questions were wrong and why.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Robust JSON extraction: Find the first '{' and the last '}'
        const firstOpen = text.indexOf('{');
        const lastClose = text.lastIndexOf('}');

        let jsonStr;
        if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
            jsonStr = text.substring(firstOpen, lastClose + 1);
        } else {
            // Fallback: try cleaning markdown if strict extraction fails
            jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        }

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Evaluation Error:", error);
        // Fallback if AI fails
        return {
            score: 0,
            isCorrect: false,
            feedback: "Evaluation unavailable at the moment. Please try again later.",
            breakdown: { correctness: 0, dataUnderstanding: 0, reasoning: 0, actionability: 0 }
        };
    }
};
