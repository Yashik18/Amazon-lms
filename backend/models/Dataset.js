const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['pi', 'helium10', 'adsLibrary'],
        required: true,
        index: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    metadata: {
        description: String,
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Dataset', datasetSchema);
