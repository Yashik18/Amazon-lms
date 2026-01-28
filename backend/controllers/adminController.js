const Dataset = require('../models/Dataset');
const Workflow = require('../models/Workflow');
const Scenario = require('../models/Scenario');

// @desc    Upload dataset
// @route   POST /api/v1/admin/datasets
// @access  Private/Admin
exports.uploadDataset = async (req, res) => {
    try {
        console.log('Upload Request Body:', JSON.stringify(req.body).substring(0, 200) + '...');
        const dataset = await Dataset.create(req.body);
        console.log('Dataset Created:', dataset._id);
        res.status(201).json({ success: true, data: dataset });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create workflow
// @route   POST /api/v1/admin/workflows
// @access  Private/Admin
exports.createWorkflow = async (req, res) => {
    try {
        const workflow = await Workflow.create(req.body);
        res.status(201).json({ success: true, data: workflow });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create scenario
// @route   POST /api/v1/admin/scenarios
// @access  Private/Admin
exports.createScenario = async (req, res) => {
    try {
        const scenario = await Scenario.create(req.body);
        res.status(201).json({ success: true, data: scenario });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Get system stats
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
exports.getSystemStats = async (req, res) => {
    try {
        const users = await require('../models/User').countDocuments();
        const workflows = await Workflow.countDocuments();
        const scenarios = await Scenario.countDocuments();
        const modules = await require('../models/Module').countDocuments();
        const datasets = await Dataset.countDocuments();

        res.json({
            success: true,
            data: {
                users,
                workflows,
                scenarios,
                modules,
                datasets
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
