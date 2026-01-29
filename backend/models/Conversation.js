const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    messages: [{
        role: {
            type: String,
            enum: ['user', 'assistant', 'system'],
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        references: [{
            type: String // Links or IDs of referenced data
        }],
        aiContext: String, // Store the full context/extracted text for AI (hidden from UI)
        attachments: [{
            fileUrl: String,
            fileType: String,
            originalName: String,
            mimeType: String,
            localPath: String // Store local path for backend processing
        }]
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Conversation', conversationSchema);
