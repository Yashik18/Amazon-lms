const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
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
    content: {
        type: String,
        required: true // Markdown or HTML content
    },
    order: {
        type: Number,
        default: 0
    },
    estimatedTime: {
        type: Number, // In minutes
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Module', moduleSchema);
