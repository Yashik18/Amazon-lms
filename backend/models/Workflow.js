const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
    stepNumber: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    instruction: {
        type: String,
        required: true
    },
    toolReference: {
        type: String,
        enum: ['pi', 'helium10', 'adsLibrary', 'none'],
        default: 'none'
    },
    sampleData: {
        type: mongoose.Schema.Types.Mixed, // Flexible for different tool data structures
        default: {}
    },
    expectedAction: {
        type: String,
        required: true
    }
});

const workflowSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    steps: [stepSchema],
    estimatedTime: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Workflow', workflowSchema);
