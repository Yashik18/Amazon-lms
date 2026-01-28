const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Scenario = require('../models/Scenario');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const scenariosInput = [
    {
        title: "Ranking Drop Crisis",
        category: "Home & Kitchen",
        difficulty: "beginner",
        description: "Diagnose a sudden drop in product ranking despite stable internal metrics.",
        context: {
            situation: "Your hero SKU in the Home & Kitchen category has been stable in the top 3 ... slipped from #3 to #14. Sales dropped 32%.",
            metrics: {
                "Your Price": "$24.99",
                "Competitor Price": "$19.99 (Deal)",
                "Your Conversion Rate (Prev Week)": "12.5%",
                "Your Conversion Rate (Today)": "8.2%",
                "PPC ACOS": "Rising (35% -> 48%)"
            }
        },
        questions: [
            {
                text: "Based on the data, what is the root cause of the sales and rank drop?",
                options: [
                    { text: "Traffic issue: Competitor is stealing search volume", isCorrect: false, explanation: "Sessions are stable, so traffic isn't the issue." },
                    { text: "Conversion issue: Competitor's low price is killing your CR", isCorrect: true, explanation: "Conversion dropped significantly due to competitor pricing." },
                    { text: "Algorithm update: Amazon penalized your listing", isCorrect: false, explanation: "No evidence of suppression or review flags." }
                ]
            },
            {
                text: "What is the most effective first action to stabilize rank?",
                options: [
                    { text: "Increase PPC bids to regain top-of-search visibility", isCorrect: false, explanation: "Spending more with low conversion will spike ACOS further." },
                    { text: "Match the competitor's deal price temporarily", isCorrect: true, explanation: "Regaining price competitiveness will fix conversion and stabilize rank." },
                    { text: "Rewrite the listing title with more keywords", isCorrect: false, explanation: "SEO changes take time and don't address the immediate pricing disadvantage." }
                ]
            }
        ]
    },
    {
        title: "Listing Suspension Appeal",
        category: "Personal Care",
        difficulty: "intermediate",
        description: "Draft an appeal for a 'Used Sold As New' policy violation.",
        context: {
            situation: "Top-selling ASIN deactivated. 3 returns citing 'Box open' and 1 'Used' review. No tamper seal.",
            metrics: {
                "Orders (Last 7 Days)": "286",
                "Returns": "14 (4.8%)",
                "Category Avg Return Rate": "1.3%",
                "Top Return Reason": "Item looked used / open"
            }
        },
        questions: [
            {
                text: "Which root cause will Amazon most likely accept in your appeal?",
                options: [
                    { text: "Customers are lying about the product condition", isCorrect: false, explanation: "Blaming customers is rarely accepted." },
                    { text: "Amazon FBA incorrectly restocked returned units", isCorrect: false, explanation: "Hard to prove without evidence." },
                    { text: "Our packaging lacks a tamper-evident seal, allowing returned units to appear used and be resold as new", isCorrect: true, explanation: "Admitting the packaging gap is a clear, actionable root cause." }
                ]
            },
            {
                text: "What is the most important corrective action to include in your Plan of Action (POA)?",
                options: [
                    { text: "Ask Amazon to manually inspect all future returns", isCorrect: false, explanation: "Amzon won't do this manually." },
                    { text: "Add tamper-evident seals and update FBA prep guidelines", isCorrect: true, explanation: "Directly addresses the root cause of 'open box' complaints." },
                    { text: "Request customers to revise their negative reviews", isCorrect: false, explanation: "Review manipulation is against policy." }
                ]
            }
        ]
    },
    {
        title: "Q4 Inventory Management",
        category: "Electronics Accessories",
        difficulty: "advanced",
        description: "Calculate Q4 reorder quantities to avoid stockouts without overstocking.",
        context: {
            situation: "Hero product entering peak Q4. Last year stocked out. Lead time 25 days + 8 days receiving. Forecast +65%.",
            metrics: {
                "Current FBA Stock": "1,450 units",
                "Avg Daily Sales (Oct)": "42 units",
                "Expected Daily Sales (Q4)": "70 units",
                "Replenishment Cycle": "33 days"
            }
        },
        questions: [
            {
                text: "How many units should you at minimum have to safely cover the full replenishment cycle?",
                options: [
                    { text: "1,386 units", isCorrect: false, explanation: "Too low." },
                    { text: "2,310 units", isCorrect: true, explanation: "70 units/day * 33 days = 2310." },
                    { text: "3,003 units", isCorrect: false, explanation: "Too high." }
                ]
            },
            {
                text: "What is the correct reorder quantity you should place today?",
                options: [
                    { text: "860 units", isCorrect: false, explanation: "Understock risk." },
                    { text: "1,350 units", isCorrect: true, explanation: "Target (2310) + Safety (490) - Current (1450) ~= 1350." },
                    { text: "2,800 units", isCorrect: false, explanation: "Overstock." }
                ]
            }
        ]
    },
    {
        title: "Product Leaking Reviews",
        category: "Home Organization",
        difficulty: "intermediate",
        description: "Investigate why positive reviews are disappearing and sales velocity is slowing.",
        context: {
            situation: "New launch, started strong. Last week orders slowed, reviews disappeared. Missing reviews from blank profiles.",
            metrics: {
                "Days Since Launch": "21",
                "Conversion Rate (Launch)": "14.2%",
                "Conversion Rate (Now)": "8.1%",
                "Review Accounts": "2 flagged as low-trust"
            }
        },
        questions: [
            {
                text: "What is the most likely reason your reviews are disappearing and velocity is slowing?",
                options: [
                    { text: "Amazon is randomly deleting positive reviews", isCorrect: false, explanation: "Unlikely to be random." },
                    { text: "Low-trust or incentivized reviews are being filtered", isCorrect: true, explanation: "Blank profiles and similar wording trigger review filters." },
                    { text: "Competitors are reporting your listing", isCorrect: false, explanation: "Competitor reports usually lead to suppression, not just review removal." }
                ]
            },
            {
                text: "What is the most effective long-term fix to prevent this from happening again?",
                options: [
                    { text: "Ask friends to post new reviews", isCorrect: false, explanation: "Against policy." },
                    { text: "Run aggressive giveaways to boost volume", isCorrect: false, explanation: "Risk of incentivized review flags." },
                    { text: "Drive authentic purchases and reviews via Vine or post-purchase flows", isCorrect: true, explanation: "Legitimate ways to build social proof." }
                ]
            }
        ]
    },
    {
        title: "High ACOS Crisis",
        category: "Fitness Accessories",
        difficulty: "beginner",
        description: "Analyze and fix an unprofitable PPC campaign for a new product.",
        context: {
            situation: "New SKU (Yoga bands), Auto Ad spending $500/day. ACOS 120%.",
            metrics: {
                "ACOS": "120%",
                "Top Search Term": "gym gloves for men",
                "Your Product": "Yoga resistance bands",
                "Budget Utilization": "98%"
            }
        },
        questions: [
            {
                text: "What is the primary reason for the high ACOS?",
                options: [
                    { text: "Bids are too low", isCorrect: false, explanation: "Spend is high, so bids are sufficient to get clicks." },
                    { text: "Irrelevant search terms are draining spend", isCorrect: true, explanation: "'Gym gloves' is irrelevant for 'Yoga bands'." },
                    { text: "Product price is too high", isCorrect: false, explanation: "Conversion rate is decent, relevance is the main issue." }
                ]
            },
            {
                text: "What is the most effective immediate fix?",
                options: [
                    { text: "Increase daily budget", isCorrect: false, explanation: "Will just waste more money." },
                    { text: "Add negative keywords and shift to manual campaigns", isCorrect: true, explanation: "Stop the bleeding on irrelevant terms." },
                    { text: "Pause all ads", isCorrect: false, explanation: "Stops sales entirely, better to optimize." }
                ]
            }
        ]
    },
    {
        title: "Hijacker Battle",
        category: "Mobile Accessories",
        difficulty: "advanced",
        description: "Identify and remove a hijacker stealing the Buy Box.",
        context: {
            situation: "Hero ASIN, Buy Box dropped to 58%. New seller with lower price. Complaints of 'fake'.",
            metrics: {
                "Your Price": "₹999",
                "Hijacker Price": "₹849",
                "Buy Box": "Dropped to 58%",
                "New Seller Rating": "3.1 stars"
            }
        },
        questions: [
            {
                text: "What confirms that this is a hijacker and not normal competition?",
                options: [
                    { text: "A new seller is offering the same ASIN with a lower price", isCorrect: false, explanation: "Could be legitimate reseller." },
                    { text: "Product images remain unchanged", isCorrect: false, explanation: "Irrelevant." },
                    { text: "A new seller is offering the same ASIN with identical content and customers report quality issues", isCorrect: true, explanation: "Indicative of counterfeit/hijack." }
                ]
            },
            {
                text: "What is the most effective immediate action?",
                options: [
                    { text: "Lower your price", isCorrect: false, explanation: "Race to the bottom." },
                    { text: "Report the seller through Brand Registry with test-buy evidence", isCorrect: true, explanation: "Official removal process." },
                    { text: "Pause ads", isCorrect: false, explanation: "No." }
                ]
            }
        ]
    },
    {
        title: "Low Impressions on New Campaign",
        category: "Home Cleaning",
        difficulty: "beginner",
        description: "Troubleshoot why a new campaign is getting zero traction.",
        context: {
            situation: "New manual campaign. 38 impressions in 24h. 0 clicks.",
            metrics: {
                "Default Bid": "₹2",
                "Suggested Bid": "₹18-25"
            }
        },
        questions: [
            {
                text: "What is the main reason the campaign is not getting impressions?",
                options: [
                    { text: "Listing is suppressed", isCorrect: false, explanation: "Listing is active." },
                    { text: "Daily budget is too low", isCorrect: false, explanation: "Budget not spent." },
                    { text: "The bids are far below market level", isCorrect: true, explanation: "Bid 2 vs Suggested 18." }
                ]
            },
            {
                text: "What is the best first action to fix this?",
                options: [
                    { text: "Increase bids closer to the suggested range", isCorrect: true, explanation: "Will win auctions and get impressions." },
                    { text: "Add more keywords", isCorrect: false, explanation: "Won't help if bids are too low." },
                    { text: "Wait 3-4 days", isCorrect: false, explanation: "Won't fix low bid issue." }
                ]
            }
        ]
    }
];

const seedScenarios = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Clear existing scenarios
        await Scenario.deleteMany({});
        console.log('Cleared old scenarios');

        // Insert new scenarios
        await Scenario.insertMany(scenariosInput);
        console.log(`Imported ${scenariosInput.length} new scenarios`);

        process.exit();
    } catch (error) {
        console.error('Error seeding scenarios:', error);
        process.exit(1);
    }
};

seedScenarios();
