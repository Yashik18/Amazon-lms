const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Workflow = require('../models/Workflow');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to DB: ${error.message}`);
        process.exit(1);
    }
};

const addWorkflows = async () => {
    await connectDB();

    const newWorkflows = [
        {
            title: "PPC Campaign Optimization",
            description: "Weekly routine to cut wasted spend and boost profitable keywords.",
            category: "PPC",
            estimatedTime: 60,
            steps: [
                { stepNumber: 1, title: "Download Search Term Report", instruction: "Go to Campaign Manager > Reports. Download the last 30 days of data.", toolReference: "none", expectedAction: "Download report" },
                { stepNumber: 2, title: "Identify Wasted Spend", instruction: "Filter for keywords with > 10 clicks and 0 sales. Add them as Negative Exact.", toolReference: "none", expectedAction: "Add negatives" },
                { stepNumber: 3, title: "Find High ACOS Targets", instruction: "Filter for ACOS > 40% (or your target). Lower bids by 20% on these keywords.", toolReference: "none", expectedAction: "Lower bids" },
                { stepNumber: 4, title: "Scale Winners", instruction: "Filter for ACOS < 20%. Raise bids by 20% to get more traffic.", toolReference: "helium10", expectedAction: "Raise bids" },
                { stepNumber: 5, title: "Keyword Harvest", instruction: "Find search terms with 3+ sales in Auto campaigns. Move them to Manual Exact campaigns.", toolReference: "helium10", expectedAction: "Move keywords" }
            ]
        },
        {
            title: "Inventory Restock Planning",
            description: "Calculate exactly when and how much to reorder to avoid stockouts.",
            category: "Inventory",
            estimatedTime: 30,
            steps: [
                { stepNumber: 1, title: "Check Sales Velocity", instruction: "Calculate average daily sales over the last 30 days.", toolReference: "pi", expectedAction: "Note velocity" },
                { stepNumber: 2, title: "Confirm Lead Time", instruction: "Contact supplier for current production + shipping time estimate.", toolReference: "none", expectedAction: "Confirm days" },
                { stepNumber: 3, title: "Calculate Reorder Point", instruction: "Reorder Point = (Lead Time x Daily Sales) + Safety Stock.", toolReference: "none", expectedAction: "Calculate point" },
                { stepNumber: 4, title: "Check Current Stock", instruction: "Check FBA + Warehouse inventory levels.", toolReference: "none", expectedAction: "Check stock" },
                { stepNumber: 5, title: "Place Order", instruction: "If Current Stock < Reorder Point, place PO immediately.", toolReference: "none", expectedAction: "Create PO" }
            ]
        }
    ];

    try {
        await Workflow.insertMany(newWorkflows);
        console.log(`-- Added ${newWorkflows.length} new workflows successfully!`);
        process.exit();
    } catch (error) {
        console.error(`Error adding workflows: ${error.message}`);
        process.exit(1);
    }
};

addWorkflows();
