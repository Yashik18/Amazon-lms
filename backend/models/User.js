const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false // Do not return password by default
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    progress: {
        // Detailed module progress
        modulesCompleted: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Module'
        }],

        // Simple completed workflows list (legacy/simple view)
        workflowsCompleted: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workflow'
        }],

        // Detailed active workflow tracking
        activeWorkflows: [{
            workflowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workflow' },
            currentStep: { type: Number, default: 0 },
            completed: { type: Boolean, default: false },
            stepHistory: [{
                step: Number,
                input: String,
                feedback: String,
                completedAt: { type: Date, default: Date.now }
            }],
            lastUpdated: { type: Date, default: Date.now }
        }],

        // Detailed scenario attempts
        scenariosAttempted: [{
            scenarioId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Scenario'
            },
            score: { type: Number, required: true },
            feedback: String, // AI feedback
            completedAt: { type: Date, default: Date.now }
        }],

        // Activity Log for Timeline
        activityLog: [{
            type: { type: String, enum: ['workflow', 'scenario', 'module', 'achievement', 'chat'], required: true },
            description: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
            meta: mongoose.Schema.Types.Mixed // Optional extra data (e.g., scenarioId)
        }],

        // Achievements
        achievements: [{
            id: { type: String, required: true }, // e.g., 'first_steps'
            earnedAt: { type: Date, default: Date.now }
        }],

        // Stats cache
        stats: {
            totalMinutes: { type: Number, default: 0 },
            currentStreak: { type: Number, default: 0 },
            lastActivityDate: { type: Date },
            questionsAsked: { type: Number, default: 0 },
            scenariosFailed: { type: Number, default: 0 }
        }
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
