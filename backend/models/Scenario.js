const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner',
        index: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    context: {
        situation: { type: String, required: true },
        piData: { type: mongoose.Schema.Types.Mixed }, // Snapshot of Pi data
        helium10Data: { type: mongoose.Schema.Types.Mixed }, // Snapshot of Helium10 data
        adsLibraryData: { type: mongoose.Schema.Types.Mixed }, // Snapshot of Ads data
        marketData: { type: mongoose.Schema.Types.Mixed },
        internalAudit: { type: mongoose.Schema.Types.Mixed },
        metrics: { type: mongoose.Schema.Types.Mixed }
    },
    questions: [{
        text: { type: String, required: true },
        options: [{
            text: { type: String, required: true },
            isCorrect: { type: Boolean, required: true },
            explanation: { type: String, required: true }
        }]
    }],
    idealAnswer: {
        type: String // For open-ended or detailed explanation
    },
    rubric: {
        type: mongoose.Schema.Types.Mixed // Scoring criteria
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Scenario', scenarioSchema);
