const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load Models
const User = require('../models/User');
const Dataset = require('../models/Dataset');
const Module = require('../models/Module');
const Workflow = require('../models/Workflow');
const Scenario = require('../models/Scenario');
const Conversation = require('../models/Conversation');

// Load Data
const piData = require('../data/seeds/piData.json');
const helium10Data = require('../data/seeds/helium10Data.json');
const adsLibraryData = require('../data/seeds/adsLibraryData.json');

// Load Env
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

const seedDatabase = async () => {
    await connectDB();

    try {
        console.log('Clearing database...');
        await User.deleteMany();
        await Dataset.deleteMany();
        await Module.deleteMany();
        await Workflow.deleteMany();
        await Scenario.deleteMany();
        await Conversation.deleteMany();

        // 1. Seed Datasets
        console.log('Seeding Datasets...');
        const datasets = [];
        const formatData = (type, dataList) => dataList.map(item => ({
            type,
            category: item.category,
            data: item,
            metadata: { description: `Sample ${type} data for ${item.category}`, lastUpdated: new Date() }
        }));
        datasets.push(...formatData('pi', piData));
        datasets.push(...formatData('helium10', helium10Data));
        datasets.push(...formatData('adsLibrary', adsLibraryData));
        await Dataset.insertMany(datasets);
        console.log(`-- Added ${datasets.length} datasets`);

        // 2. Seed Modules
        console.log('Seeding Modules...');
        const modules = [
            {
                title: "Understanding Amazon SEO",
                description: "Learn the fundamentals of Amazon's A9 algorithm and how to rank.",
                category: "Keyword Research",
                content: "# Amazon SEO Fundamentals\n\nAmazon's search engine is transactional. It cares about two things: **Relevance** and **Performance**.\n\n## Key Ranking Factors\n\n1. **Text Match Relevancy**:\n   - **Title**: The most important field. Must contain your high-volume root keywords.\n   - **Bullet Points**: Indexing for secondary keywords and long-tail variations.\n   - **Backend Keywords**: Invisible to customers but indexed by the algorithm.\n\n2. **Sales Velocity**:\n   - Amazon rewards products that sell. The more you sell, the higher you rank.\n   - This creates a flywheel effect: Rank -> Traffic -> Sales -> Higher Rank.\n\n3. **Conversion Rate (CVR)**:\n   - It's not enough to get traffic; you must convert it.\n   - CVR = Orders / Sessions.\n   - A high CVR signals to Amazon that customers love your product.\n\n## Action Plan\n- Audit your title for the top 5 keywords.\n- Ensure your main image is click-worthy (CTR).\n- Check your price competitiveness.",
                order: 1,
                estimatedTime: 15
            },
            {
                title: "Long-tail Keywords",
                description: "Finding low competition gems.",
                category: "Keyword Research",
                content: "# Long-tail Keywords Strategy\n\nLong-tail keywords are search phrases with 3+ words. They have lower search volume but **higher conversion rates**.\n\n## Why Target Long-tails?\n- **Lower CPC**: Fewer competitors bid on them.\n- **High Intent**: A customer searching for *\"blue yoga mat for sensitive knees\"* knows exactly what they want, unlike someone searching *\"yoga mat\"*.\n- **Easier Ranking**: You can rank on Page 1 for long-tails quickly, building momentum for broader terms.\n\n## How to Find Them\n1. Use **Helium 10 Magnet** or **MerchantWords**.\n2. Filter for keywords with 500-2000 search volume.\n3. Look for phrases that describe specific features or benefits.\n\n## Implementation\n- Place these phrases in your bullet points and backend search terms.\n- Create exact match PPC campaigns with low bids.",
                order: 2,
                estimatedTime: 10
            },
            {
                title: "Keyword Golden Ratio (KGR)",
                description: "Advanced strategy for new products.",
                category: "Keyword Research",
                content: "# Keyword Golden Ratio (KGR)\n\nThe KGR is a data-driven strategy to find keywords that you can rank for in the top 50 within days, even without reviews.\n\n## The Formula\n**KGR = Allintitle Results / Search Volume**\n\n- **Allintitle**: Number of Google results with the phrase in the title (proxy for competition).\n- **Search Volume**: Must be under 250.\n\n## The Rule\n- **KGR < 0.25**: Great! You should rank in the top 50 once your page is indexed.\n- **0.25 < KGR < 1.00**: Maybe. Worth testing.\n- **KGR > 1.00**: Bad. Too much competition.\n\n## Workflow\n1. Find a list of potential keywords.\n2. Check Google `allintitle:\"keyword\"`.\n3. Divide by local monthly search volume.\n4. If < 0.25, write a blog post or optimized listing section.",
                order: 3,
                estimatedTime: 15
            },
            {
                title: "PPC Campaign Basics",
                description: "Introduction to Sponsored Products, Brands, and Display ads.",
                category: "PPC",
                content: "# Amazon PPC Basics\n\nPay-Per-Click (PPC) is the fastest way to get visibility. You pay only when a customer clicks your ad.\n\n## Campaign Types\n\n### 1. Sponsored Products\n- Appear in search results and on product pages.\n- Look like organic listings.\n- **Highest conversion rate**.\n- Start here!\n\n### 2. Sponsored Brands\n- Banner ads at the top of search results.\n- Feature your logo, headline, and 3 products.\n- Good for brand awareness and top-of-funnel traffic.\n\n### 3. Sponsored Display\n- Retargeting ads.\n- Appear on and off Amazon (other websites/apps).\n- Use to target customers who viewed your product but didn't buy.\n\n## Key Metrics\n- **ACOS (Advertising Cost of Sales)**: Ad Spend / Ad Sales. Lower is usually better.\n- **ROAS (Return on Ad Spend)**: Ad Sales / Ad Spend. Higher is better.",
                order: 1,
                estimatedTime: 20
            },
            {
                title: "Negative Keywords",
                description: "Stop wasting money on bad clicks.",
                category: "PPC",
                content: "# Negative Keywords Mastery\n\nA Negative Keyword tells Amazon **where NOT to show your ad**.\n\n## Why Use Them?\n- **Save Money**: Stop paying for clicks that never convert.\n- **Increase CTR**: Show ads only to relevant searches.\n- **Improve Quality Score**: Better relevance = lower CPC.\n\n## Types\n1. **Negative Exact**: Excludes the exact phrase. e.g., Negative Exact *\"shoes\"* -> won't show for *\"shoes\"*, but will show for *\"red shoes\"*.\n2. **Negative Phrase**: Excludes the phrase and anything added to it. e.g., Negative Phrase *\"free\"* -> blocks *\"free shoes\"*, *\"free shipping\"*, etc.\n\n## Strategy\n- Download your **Search Term Report** weekly.\n- Sort by Spend descending.\n- Identify terms with high spend and 0 sales.\n- Add them to your Negative Exact list immediately.",
                order: 2,
                estimatedTime: 10
            },
            {
                title: "ACOS vs TACOS",
                description: "Understanding profitability metrics.",
                category: "PPC",
                content: "# ACOS vs. TACOS\n\nUnderstanding financial health requires looking beyond just ad performance.\n\n## ACOS (Advertising Cost of Sales)\n- **Formula**: `Ad Spend / Ad Sales`\n- **Measures**: Efficiency of your ad campaigns.\n- **Goal**: Usually break-even or profitable (e.g., 30%).\n\n## TACOS (Total Advertising Cost of Sales)\n- **Formula**: `Ad Spend / Total Sales (Organic + Ad)`\n- **Measures**: Impact of ads on overall business growth.\n- **Goal**: 10-15% for mature products. Higher for launches.\n\n## The Relationship\n- If **ACOS is high** but **TACOS is low**, your ads are driving lots of organic sales (Ranking benefit). This is good!\n- If **TACOS is rising**, your organic sales are slipping, or you are overspending on ads without organic lift. **Danger zone.**",
                order: 3,
                estimatedTime: 15
            },
            {
                title: "Bid Optimization Strategies",
                description: "When to raise or lower bids.",
                category: "PPC",
                content: "# PPC Bid Optimization\n\nBidding is an art and science. The goal is to pay the right price for a conversion.\n\n## The Core Logic\n1. **High ACOS (> Target)**: \n   - **Action**: Lower Bid.\n   - **Why**: You are paying too much for the sale. Lowering bid reduces CPC and improves ACOS.\n\n2. **Low ACOS (< Target)**:\n   - **Action**: Raise Bid.\n   - **Why**: You are profitable! Spend more to get more volume and rank higher.\n\n3. **No Impressions**:\n   - **Action**: Raise Bid drastically.\n   - **Why**: Your bid is too low to even enter the auction.\n\n4. **Clicks but No Sales**:\n   - **Action**: Lower Bid or Pause.\n   - **Why**: The keyword is not relevant or your listing isn't converting.\n\n## Frequency\nOptimize your bids **twice a week**. Daily changes can be reactionary; monthly is too slow.",
                order: 4,
                estimatedTime: 20
            },
            {
                title: "Listing Optimization",
                description: "How to craft high-converting titles, bullets, and A+ content.",
                category: "Listing",
                content: "# Listing Optimization Guide\n\nYour listing is your digital storefront. It must Persuade and Convert.\n\n## The Layout\n\n### 1. Title\n- **Role**: SEO & CTR.\n- **Format**: Brand + Hero Keyword + Key Features + Size/Color.\n- **Tip**: Keep the first 80 characters the most impactful for mobile users.\n\n### 2. Bullet Points\n- **Role**: Conversion.\n- **Format**: 5 bullets. Use all CAPS for the hook at the start of each bullet.\n- **Content**: Focus on BENEFITS, not features. Don't say \"1000mAH battery\". Say \"Lasts 3 days on a single charge\".\n\n### 3. Images\n- **Role**: CTR & Conversion.\n- **Mandatory**: Main image on pure white. 6 lifestyle/infographic images.\n- **Video**: Increases CVR by up to 80%.\n\n### 4. A+ Content\n- Use rich graphics to tell your brand story and cross-sell other products.",
                order: 1,
                estimatedTime: 25
            },
            {
                title: "Product Photography",
                description: "Visual rules for click-through rate.",
                category: "Listing",
                content: "# Product Photography Rules\n\nHumans are visual creatures. We buy with our eyes.\n\n## Main Image (The Hero)\n- **Goal**: Maximize Click-Through Rate (CTR).\n- **Rules**:\n  - Pure white background (RGB 255,255,255).\n  - Product must fill 85% of the frame.\n  - No props or badges (unless embedded on product).\n  - **Pro Tip**: Use 3D rendering for perfect lighting and angles.\n\n## Secondary Images (The Sales Pitch)\n1. **Infographics**: Show dimensions, materials, and key specs visually.\n2. **Lifestyle**: Show the product *in use* by your target demographic. Evoke emotion.\n3. **Comparison Chart**: \"Us vs. Them\". Show why you are better.\n\n## Technical Specs\n- Size: 2000x2000px minimum (for zoom).\n- Format: JPEG.",
                order: 2,
                estimatedTime: 15
            },
            {
                title: "Writing Killer Bullet Points",
                description: "Copywriting that sells.",
                category: "Listing",
                content: "# Copywriting for Amazon Bullets\n\nDon't just list specs. Sell the dream.\n\n## Formula: The \"So What?\" Test\nFor every feature, ask \"So what?\"\n- Feature: \"Double-stitched seams.\"\n- So what? \"It won't rip.\"\n- Bullet: **BUILT TO LAST**: Features reinforced double-stitched seams so you never have to worry about rips or tears during intense workouts.\n\n## Structure\n1. **The Hook**: 2-4 words in CAPS.\n2. **The Benefit**: Emotional connection.\n3. **The Feature**: Technical support.\n\n## SEO Note\nInclude long-tail keywords in your bullets naturally. Don't keyword stuff to the point of unreadability.",
                order: 3,
                estimatedTime: 20
            },
            {
                title: "Backend Keywords",
                description: "Hidden search terms.",
                category: "Listing",
                content: "# Backend Search Terms\n\nThese are invisible keywords hidden in the `Search Terms` field in Seller Central.\n\n## Rules\n1. **Limit**: < 250 bytes (not characters). If you go over, Amazon indexes NOTHING.\n2. **No Repetition**: Don't repeat words from your Title or Bullets. It doesn't help.\n3. **No Commas**: Just use spaces.\n\n## What to Include\n- **Misspellings**: *\"iphone\"* -> *\"ipone\"*.\n- **Spanish Terms**: *\"regalos para hombres\"*.\n- **Synonyms**: *\"sneakers\"* -> *\"trainers\"*, *\"kicks\"*, *\"running shoes\"*.\n\n## How to Check\nUse a specialized tool or check indexing by searching `ASIN + Keyword` on Amazon.",
                order: 4,
                estimatedTime: 10
            },
            {
                title: "Reading Share of Voice",
                description: "Analyze competitor market share using Pi data.",
                category: "Competitor Analysis",
                content: "# Share of Voice (SOV) Analysis\n\nSOV is the percentage of the market traffic that your brand captures.\n\n## Measurements\n1. **Desktop vs. Mobile**: Where are you winning?\n2. **Organic vs. Paid**: Are you buying your traffic or earning it?\n\n## Danger Signs\n- **Decreasing Organic SOV**: Competitors are outranking you. Check their content and price.\n- **Decreasing Paid SOV**: You are being outbid. Check your CPCs.\n\n## Actionable Insight\nIf you see a competitor's SOV spiking, check what they changed. Did they lower price? Change title? Run a deal? Reverse engineer their success.",
                order: 1,
                estimatedTime: 10
            },
            {
                title: "Analyzing Reviews",
                description: "Mining customer sentiment.",
                category: "Competitor Analysis",
                content: "# Mining Reviews for Gold\n\nYour competitors' customers are your best source of product research.\n\n## 1-Star Review Analysis\nRead the negative reviews of the top 5 competitors.\n- **Complaint**: \"The handle broke after 2 days.\"\n- **Opportunity**: Reinforce your handle and market it as \"Indestructible Handle\".\n\n## 3-Star Review Analysis\nThese are the most honest reviews.\n- Look for \"I liked it BUT...\". That \"but\" is your gap in the market.\n\n## Keyword Mining\nWhat words do customers use to describe the product? Use *their* language in your copy, not industry jargon.",
                order: 2,
                estimatedTime: 15
            },
            {
                title: "Price Elasticity Testing",
                description: "Testing price points.",
                category: "Competitor Analysis",
                content: "# Price Elasticity of Demand\n\nHow sensitive are your customers to price changes?\n\n## The Test\n1. Run at $19.99 for 1 week. Track Sessions and CVR.\n2. Raise to $21.99 for 1 week. Track Sessions and CVR.\n\n## Scenarios\n- **Inelastic**: Price goes up 10%, Sales drop 2%. -> **RAISE PRICE**. You make more profit.\n- **Elastic**: Price goes up 10%, Sales drop 20%. -> **KEEP PRICE LOW**. The volume loss outweighs the margin gain.\n\n## Monitoring\nAlways watch your BSR (Best Seller Rank) during tests. If BSR tanks, revert immediately.",
                order: 3,
                estimatedTime: 20
            }
        ];
        await Module.insertMany(modules);
        console.log(`-- Added ${modules.length} modules`);

        // 3. Seed Workflows
        console.log('Seeding Workflows...');
        const workflows = [
            {
                title: "New Product Launch",
                description: "Step-by-step playbook for launching a product to page 1.",
                category: "Launch",
                estimatedTime: 120, // minutes
                steps: [
                    { stepNumber: 1, title: "Keyword Setup", instruction: "Identify top 10 'hero' keywords using Helium 10.", toolReference: "helium10", expectedAction: "List 10 keywords" },
                    { stepNumber: 2, title: "Listing Audit", instruction: "Ensure Listing score > 9/10.", toolReference: "none", expectedAction: "Confirm score" },
                    { stepNumber: 3, title: "PPC Setup", instruction: "Create Auto campaign and Manual Exact for hero keywords.", toolReference: "none", expectedAction: "Create campaigns" },
                    { stepNumber: 4, title: "Price Strategy", instruction: "Set launch price 15% below market average for velocity.", toolReference: "pi", expectedAction: "Set price" },
                    { stepNumber: 5, title: "Review Request", instruction: "Enable Vine program for early reviews.", toolReference: "none", expectedAction: "Enroll in Vine" }
                ]
            },
            {
                title: "Low Impressions Troubleshooting",
                description: "Diagnose and fix campaigns with no visibility.",
                category: "PPC",
                estimatedTime: 45,
                steps: [
                    { stepNumber: 1, title: "Check indexing", instruction: "Search for your ASIN + Keyword. Do you show up?", toolReference: "none", expectedAction: "Verify indexing" },
                    { stepNumber: 2, title: "Review Bids", instruction: "Are bids below suggested range? Increase by 20%.", toolReference: "helium10", expectedAction: "Adjust bids" },
                    { stepNumber: 3, title: "Budget Check", instruction: "Is campaign out of budget early in the day?", toolReference: "none", expectedAction: "Check budget" },
                    { stepNumber: 4, title: "Relevance", instruction: "Check if ads are suppressed due to irrelevance.", toolReference: "none", expectedAction: "Check suppression" },
                    { stepNumber: 5, title: "Targeting", instruction: "Add broader distinct keywords.", toolReference: "helium10", expectedAction: "Add keywords" }
                ]
            }
        ];
        await Workflow.insertMany(workflows);
        console.log(`-- Added ${workflows.length} workflows`);

        // 4. Seed Scenarios
        console.log('Seeding Scenarios...');
        const scenarios = [
            {
                title: "Ranking Drop Crisis (Advanced)",
                description: "Your hero product's organic rank plummeted from #3 to #14. Diagnose and fix.",
                difficulty: "advanced",
                category: "PPC",
                context: {
                    situation: "It's Tuesday morning. You notice sales are down 40% week-over-week. Your main competitor has a 'Limited Time Deal' badge.",
                    marketData: {
                        "Your Price": "$24.99",
                        "Competitor Price": "$19.99 (Deal)",
                        "Your Conversion Rate (prev week)": "12.5%",
                        "Your Conversion Rate (today)": "8.2%",
                        "PPC ACOS": "Rising (35% -> 48%)",
                        "Sessions": "Stable"
                    }
                },
                questions: [
                    {
                        text: "Based on the data, what is the root cause of the sales drop?",
                        options: [
                            {
                                text: "Traffic issue: Competitor is stealing search volume.",
                                isCorrect: false,
                                explanation: "Sessions are stable, so you are getting the same traffic. The problem is they aren't buying (Conversion drop)."
                            },
                            {
                                text: "Conversion issue: Competitor's low price is killing your CR.",
                                isCorrect: true,
                                explanation: "Correct. Stable traffic + Dropping CR + Rising ACOS = Price disadvantage."
                            },
                            {
                                text: "Algorithm update: Amazon penalized your listing.",
                                isCorrect: false,
                                explanation: "Unlikely to see specific ACOS rise/CR drop pattern just from an algo update without session changes."
                            }
                        ]
                    },
                    {
                        text: "What is your immediate tactical response?",
                        options: [
                            {
                                text: "Lower price to $18.99 to undercut.",
                                isCorrect: false,
                                explanation: "Too aggressive. You destroy margins and start a price war."
                            },
                            {
                                text: "Run a 15% off coupon to close the gap temporarily.",
                                isCorrect: true,
                                explanation: "Coupons increase CTR/CR without permanently lowering price history."
                            },
                            {
                                text: "Pause PPC to stop the bleeding.",
                                isCorrect: false,
                                explanation: "This will kill your sessions and rank even further."
                            }
                        ]
                    }
                ],
                idealAnswer: "Identify price sensitivity issue. Use coupons to recover CR without resetting price anchor.",
                rubric: { keyPoints: ["Identify CR drop", "Use Coupons for short term fix"] }
            },
            {
                title: "Listing Suspension Appeal",
                description: "Amazon flagged your listing for 'Used Sold as New'. Draft the Plan of Action (POA).",
                difficulty: "intermediate",
                category: "Compliance",
                context: {
                    situation: "Three customers returned your item claiming the box was open or seal broken. Amazon deactivated the ASIN.",
                    internalAudit: {
                        "Return Rate": "4.5% (Category avg: 2%)",
                        "FBA Prep": "Polybagged, no safety seal",
                        "Inventory": "Commangled (stickerless)"
                    }
                },
                questions: [
                    {
                        text: "Which root cause will Amazon accept?",
                        options: [
                            { text: "Customers are lying.", isCorrect: false, explanation: "Never blame the customer." },
                            { text: "Amazon FBA restocking error.", isCorrect: false, explanation: "You must take ownership of the packaging flaw that allow this." },
                            { text: "Inadequate packaging (no tamper seal) allowed used returns to be resold.", isCorrect: true, explanation: "Specific, actionable, accepts responsibility." }
                        ]
                    },
                    {
                        text: "What is the Preventive Action?",
                        options: [
                            { text: "We will inspect every unit manually.", isCorrect: false, explanation: "Impossible with FBA." },
                            { text: "Recall inventory, apply safety seals to all future units, disable Repackaging.", isCorrect: true, explanation: "Comprehensive fix." }
                        ]
                    }
                ],
                idealAnswer: "Root Cause: Inadequate packaging. Fix: Safety seals + Settings change.",
                rubric: { keyPoints: ["Accept responsibility", "Safety seals"] }
            },
            {
                title: "Q4 Inventory Management",
                description: "Calculate the exact restock order to avoid stockout during Christmas.",
                difficulty: "advanced",
                category: "Inventory",
                context: {
                    situation: "It is October 15th. Supplier lead time is 45 days. You need stock for Dec 1 - Jan 15.",
                    metrics: {
                        "Current Inventory": "2,000 units",
                        "Oct Avg Sales/Day": "50 units",
                        "Expected Dec Sales Multiplier": "3.5x (based on last year)",
                        "Safety Stock": "10 days"
                    }
                },
                questions: [
                    {
                        text: "How many units should you order NOW to cover the Q4 rush?",
                        options: [
                            {
                                text: "2,000 units",
                                isCorrect: false,
                                explanation: "Too low. 50 units/day * 3.5x = 175/day in Dec. You need thousands."
                            },
                            {
                                text: "5,000 units",
                                isCorrect: false,
                                explanation: "Let's calculate: 45 days Dec/Jan demand @ 175/day = 7,875. You have 2,000. Need ~6,000+."
                            },
                            {
                                text: "8,000 units",
                                isCorrect: true,
                                explanation: "Dec Demand (31 days * 175) + Jan 1-15 (15 * 100 est) = ~7,000 sales. Plus safety stock. Minus 2,000 on hand. 8,000 is the safest bet to avoid Q4 stockout."
                            }
                        ]
                    }
                ],
                idealAnswer: "Order 8,000 units. Calculation: (Dec Demand: 5,425) + (Jan Buffer: 2,500) - (Stock: 2,000) + (Lead Time Buffer). Better to overstock slightly in Q4 than stockout.",
                rubric: { keyPoints: ["Apply seasonality multiplier", "Factor in lead time", "Account for existing stock"] }
            },
            {
                title: "Product Leaking Reviews",
                description: "Your new launch has 5 stars, but velocity is stalling. Reviews are suddenly disappearing.",
                difficulty: "intermediate",
                category: "Compliance",
                context: {
                    situation: "You launched a Vitamin C serum 3 weeks ago. You got 15 reviews in 10 days using a 'rebate' group. Amazon just wiped 12 of them.",
                    metrics: {
                        "Review Count": "15 -> 3",
                        "Rating": "5.0 -> 4.3",
                        "Account Health": "Warning: Customer Review Policy Violation",
                        "Source of Reviews": "Facebook Group 'Amazon Testers'"
                    }
                },
                questions: [
                    {
                        text: "What did you do wrong, and how do you save the listing?",
                        options: [
                            {
                                text: "Contact Seller Support and claim the reviews were organic.",
                                isCorrect: false,
                                explanation: "Bad idea. Amazon has sophisticated algorithms linking the buyers. Lying will get you suspended."
                            },
                            {
                                text: "Immediately stop the rebate campaigns. Acknowledge the violation in Account Health. Restart with Vine.",
                                isCorrect: true,
                                explanation: "You violated TOS by incentivizing reviews (off-platform rebates). You must stop, admit fault (if asked), and switch to compliant methods like Vine."
                            },
                            {
                                text: "Use a different Facebook group to spread out the pattern.",
                                isCorrect: false,
                                explanation: "This is doubling down on a violation. You will be permanently banned."
                            }
                        ]
                    }
                ],
                idealAnswer: "Stop all off-platform incentivized review activities immediately. The 'rebate' model is strictly against TOS. Use Amazon Vine to rebuild compliant reviews.",
                rubric: { keyPoints: ["Identify TOS violation", "Stop non-compliant activity", "Switch to Vine"] }
            },
            {
                title: "High ACOS Nightmare",
                description: "Your new Auto Campaign is spending $500/day with 120% ACOS.",
                difficulty: "beginner",
                category: "PPC",
                context: {
                    situation: "You launched an Auto campaign for a 'Leather Wallet'. It's getting tons of clicks but few sales.",
                    searchTermReport: {
                        "Top Spend Keyword": "'phone case wallet' ($150 spend, 0 sales)",
                        "Second Spend": "'cheap velcro wallet' ($80 spend, 0 sales)",
                        "CTR": "0.3%",
                        "Conversion Rate": "1.5%"
                    }
                },
                questions: [
                    {
                        text: "What is the single most effective action to reduce ACOS within 24 hours?",
                        options: [
                            {
                                text: "Lower the daily budget to $50.",
                                isCorrect: false,
                                explanation: "This caps the bleeding but doesn't fix the efficiency. You'll just run out of money earlier without getting profitable sales."
                            },
                            {
                                text: "Add 'phone case' and 'velcro' as Negative Phrase keywords.",
                                isCorrect: true,
                                explanation: "Correct. These terms are irrelevant (you sell leather wallets). Negating them stops the wasted spend immediately."
                            },
                            {
                                text: "Increase the bid to get better ad placement.",
                                isCorrect: false,
                                explanation: "Increasing bids on bad keywords will just lose you money faster."
                            }
                        ]
                    }
                ],
                idealAnswer: "Aggressively add Negative Keywords from the Search Term Report. 'Phone case' and 'velcro' are wasting budget. Negating them will immediately drop ACOS.",
                rubric: { keyPoints: ["Analyze Search Term Report", "Identify irrelevant traffic", "Use Negative Keywords"] }
            },
            {
                title: "Hijacker Battle",
                description: "A random seller 'JustLaunched123' is selling your Private Label product for 50% less.",
                difficulty: "advanced",
                category: "Listing",
                context: {
                    situation: "You own the brand 'EcoBottle'. You are the manufacturer. Suddenly, 'JustLaunched123' appears on your listing and takes the Buy Box.",
                    details: {
                        "Your Price": "$29.99",
                        "Hijacker Price": "$14.99",
                        "Test Buy Result": "Item arrived in a generic plastic bag, different material, no logo."
                    }
                },
                questions: [
                    {
                        text: "How do you remove this hijacker legally?",
                        options: [
                            {
                                text: "Message them threatening legal action.",
                                isCorrect: false,
                                explanation: "Harassment is against TOS. Plus, bots often ignore messages."
                            },
                            {
                                text: "Buy out their inventory to clear them.",
                                isCorrect: false,
                                explanation: "Expensive and risky. They might just restock fake inventory."
                            },
                            {
                                text: "Report 'Counterfeit' violation to Amazon using Brand Registry (or Report Abuse form) with photos from the Test Buy.",
                                isCorrect: true,
                                explanation: "Correct. You have proof (Test Buy) that the product does not match the detail page (Material difference, Logo missing). This is the only official removal path."
                            }
                        ]
                    }
                ],
                idealAnswer: "Conduct a Test Buy. Photograph the differences (Material, Logo, Packaging). Open a Trademark/Counterfeit violation case via Brand Registry referencing the Test Buy Order ID.",
                rubric: { keyPoints: ["Conduct Test Buy", "Identify material differences", "Report via Brand Registry"] }
            },
            {
                title: "Example Scenario (Simple)",
                description: "A simple check.",
                difficulty: "beginner",
                category: "Basics",
                context: { situation: "Just checking scoring." },
                questions: [
                    {
                        text: "Is this correct?",
                        options: [
                            { text: "Yes", isCorrect: true, explanation: "Yes" },
                            { text: "No", isCorrect: false, explanation: "No" }
                        ]
                    }
                ],
                idealAnswer: "Yes",
                rubric: { keyPoints: ["Yes"] }
            }
        ];
        await Scenario.insertMany(scenarios);
        console.log(`-- Added ${scenarios.length} scenarios`);

        // 5. Seed User
        console.log('Seeding Demo User...');
        // Hash password manually or rely on pre-save hook? 
        // User model has pre-save hook, so we just pass raw password.
        const user = await User.create({
            name: "Demo User",
            email: "demo@example.com",
            password: "Demo123!",
            role: "user",
            progress: {
                modulesCompleted: [],
                workflowsCompleted: [],
                scenariosAttempted: []
            }
        });
        console.log(`-- Created user: ${user.email} / Demo123!`);

        console.log('DATABASE SEEDED SUCCESSFULLY');
        process.exit();

    } catch (error) {
        console.error(`Seeding Failed: ${error.message}`);
        process.exit(1);
    }
};

seedDatabase();
