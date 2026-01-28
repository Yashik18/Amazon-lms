const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Workflow = require('../models/Workflow');
const Scenario = require('../models/Scenario');
const Module = require('../models/Module');
const Dataset = require('../models/Dataset');

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkStats = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const users = await User.countDocuments();
        const workflows = await Workflow.countDocuments();
        const scenarios = await Scenario.countDocuments();
        const modules = await Module.countDocuments();
        const datasets = await Dataset.countDocuments();

        console.log('--- DB STATS ---');
        console.log(`Users: ${users}`);
        console.log(`Workflows: ${workflows}`);
        console.log(`Scenarios: ${scenarios}`);
        console.log(`Modules: ${modules}`);
        console.log(`Datasets: ${datasets}`);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkStats();
