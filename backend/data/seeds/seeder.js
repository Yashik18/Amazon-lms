const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Dataset = require('../../models/Dataset');
const User = require('../../models/User');
const piData = require('./piData.json');
const helium10Data = require('./helium10Data.json');
const adsLibraryData = require('./adsLibraryData.json');
const path = require('path');

// Fix: Use absolute path to .env file to ensure it loads correctly regardless of CWD
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in .env");
        }
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await connectDB();

        await Dataset.deleteMany(); // Clear existing datasets
        await User.deleteMany(); // Clear existing users

        // Create Users
        const usersData = [
            {
                name: 'Demo User',
                email: 'demo@example.com',
                password: 'password123',
                role: 'user',
                progress: {
                    activeWorkflows: [],
                    workflowsCompleted: [],
                    scenariosAttempted: [],
                    activityLog: [],
                    achievements: [],
                    stats: { totalMinutes: 0, currentStreak: 0, questionsAsked: 0 }
                }
            },
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
                progress: {
                    activeWorkflows: [],
                    workflowsCompleted: [],
                    scenariosAttempted: [],
                    activityLog: [],
                    achievements: [],
                    stats: { totalMinutes: 0, currentStreak: 0, questionsAsked: 0 }
                }
            }
        ];

        for (const user of usersData) {
            await User.create(user);
        }
        console.log('Users Created (demo@example.com, admin@example.com)');

        const datasets = [];

        // Helper to format seed data into Dataset model structure
        const formatData = (type, dataList) => {
            // Handle array of objects or direct objects depending on structure
            return dataList.map(item => ({
                type,
                category: item.category,
                data: item,
                metadata: {
                    description: `Sample ${type} data for ${item.category}`,
                    lastUpdated: new Date()
                }
            }));
        };

        datasets.push(...formatData('pi', piData));
        datasets.push(...formatData('helium10', helium10Data));
        datasets.push(...formatData('adsLibrary', adsLibraryData));

        await Dataset.insertMany(datasets);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();
        await Dataset.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
}

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
