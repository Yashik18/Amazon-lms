const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

// Load Env
dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const adminEmail = "admin@example.com";
        const adminPassword = "Admin123!";

        // Check if exists
        const exists = await User.findOne({ email: adminEmail });
        if (exists) {
            console.log('Admin user already exists.');
            process.exit(0);
        }

        const admin = await User.create({
            name: "Admin User",
            email: adminEmail,
            password: adminPassword,
            role: "admin",
            progress: {
                modulesCompleted: [],
                workflowsCompleted: [],
                scenariosAttempted: []
            }
        });

        console.log(`Admin created successfully:`);
        console.log(`Email: ${admin.email}`);
        console.log(`Password: ${adminPassword}`);

        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
