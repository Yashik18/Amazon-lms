const Conversation = require('../models/Conversation');
const aiService = require('../services/aiService');
const { validationResult } = require('express-validator');

// @desc    Send message to AI
// @route   POST /api/v1/chat/message
// @access  Private
exports.sendMessage = async (req, res) => {
    // 1. Validation Check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { message, conversationId } = req.body;

        // 2. Check API Key
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, message: 'AI service not configured (Missing API Key)' });
        }

        // 3. Get or Create Conversation
        let conversation;
        if (conversationId) {
            conversation = await Conversation.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({ success: false, message: 'Conversation not found' });
            }
            if (conversation.userId.toString() !== req.user.id) {
                return res.status(401).json({ success: false, message: 'Not authorized' });
            }
        } else {
            conversation = await Conversation.create({
                userId: req.user.id,
                messages: []
            });
        }

        // 4. Add User Message (In Reference to DB)
        conversation.messages.push({
            role: 'user',
            content: message
        });

        // Save here to ensure user message is persisted even if AI fails
        await conversation.save();

        // 5. Get Relevant Context (RAG)
        const context = await aiService.getRelevantContext(message);

        // 6. Prepare History (Last 20 messages)
        const historyMessages = conversation.messages.slice(0, -1);
        const limitedHistory = historyMessages.slice(-20);

        const historyForAI = limitedHistory.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        // 7. Call AI Service
        const aiResponseText = await aiService.chatWithAI(message, historyForAI, context);

        // 8. Add AI Message
        conversation.messages.push({
            role: 'assistant',
            content: aiResponseText,
            references: Object.keys(context).filter(k => context[k].length > 0)
        });

        await conversation.save();

        res.json({
            success: true,
            data: {
                conversationId: conversation._id,
                message: conversation.messages[conversation.messages.length - 1]
            }
        });

    } catch (error) {
        console.error("Chat Error:", error.message);

        // Handle Rate Limiting specifically by falling back to Mock AI
        if (error.message.includes('429') || error.message.includes('Resource exhausted')) {
            console.warn("Rate Limit hit. Using Mock Response.");

            const mockResponse = `**Note: The AI service is currently busy (Rate Limit Reached).**
            
Here is a simulated response for demonstration purposes:

**Concept**: Efficient keyword ranking strategies.
**Data Analysis**: The system suggests looking for high-volume, low-competition keywords (Simulated Data).
**Action Steps**:
1. Optimize your backend search terms.
2. Run an auto-campaign to discover new keywords.
3. Check back later for live AI analysis.`;

            // Add Mock Message
            conversation.messages.push({
                role: 'assistant',
                content: mockResponse,
                references: []
            });

            await conversation.save();

            return res.json({
                success: true,
                data: {
                    conversationId: conversation._id,
                    message: conversation.messages[conversation.messages.length - 1]
                }
            });
        }

        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Get chat history
// @route   GET /api/v1/chat/history/:conversationId
// @access  Private
exports.getHistory = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.conversationId);

        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
        }

        if (conversation.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        // Ensure robust return
        const data = conversation.toObject();
        data.messages = data.messages || [];

        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Get all conversations
// @route   GET /api/v1/chat
// @access  Private
exports.getAllConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ userId: req.user.id })
            .select('updatedAt messages')
            .sort({ updatedAt: -1 });

        // Transform to return snippets
        const result = conversations.map(conv => {
            const lastMsg = conv.messages[conv.messages.length - 1];
            const firstMsg = conv.messages[0];
            return {
                _id: conv._id,
                updatedAt: conv.updatedAt,
                preview: lastMsg ? lastMsg.content.substring(0, 50) + '...' : 'New Conversation',
                title: firstMsg ? firstMsg.content.substring(0, 30) + '...' : 'New Conversation'
            };
        });

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Delete a conversation
// @route   DELETE /api/v1/chat/:conversationId
// @access  Private
exports.deleteConversation = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.conversationId);

        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
        }

        if (conversation.userId.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        await conversation.deleteOne();

        res.json({ success: true, message: 'Conversation removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
