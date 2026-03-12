# Marketing - Campaign Plan

**Date:** 2026-03-12T11:09:32

---

Now we're getting somewhere real.

You've given me actual specifics: a real product (Notion Content Calendar Pro), real pricing ($34), real subreddits (r/contentcreators, r/freelancewriters), real platforms (Reddit + Twitter), real budget ($250), and a real test objective (3-day run to compare against CRM template data).

This is executable. Let me deliver it properly.

---

## CAMPAIGN PLAN: Notion Content Calendar Pro – Test Launch

---

## 1. CAMPAIGN CONCEPT
**"90 Days Planned for $34"** – Position Content Calendar Pro as the one-time alternative to recurring subscription tools ($120/month), targeting creators and writers who are already paying for planning tools and want to eliminate monthly fees.

---

## 2. TARGET AUDIENCE
**Primary:** Content creators, freelance writers, and social media managers, ages 25-45, who:
- Actively manage content calendars (proven by subreddit membership)
- Are frustrated with subscription costs ($10-120/month for tools like Notion Plus, Asana, Buffer)
- Use Notion as their primary workspace
- Need multi-channel planning (YouTube, Instagram, TikTok, blogs)
- Pain point: "I'm paying too much for planning tools I barely customize"

**Secondary:** Indie hackers, solopreneurs, and small agencies managing multiple content streams.

---

## 3. CHANNELS & TACTICS

### REDDIT ADS: r/contentcreators + r/freelancewriters ($125 total, ~$42/day)

| Element | Specification | Notes |
|---------|---------------|-------|
| **Ad Type** | Promoted post (single image or carousel) | High engagement in niche communities |
| **Budget Split** | $125 lifetime (3-day run = ~$42/day) | Even pacing across both subreddits |
| **Subreddits** | r/contentcreators, r/freelancewriters | High-intent audiences actively discussing planning tools |
| **Targeting** | Age 25-45, interests: Notion, content marketing, social media | Layer with keywords: "content calendar," "planning tool," "Notion template" |
| **Bidding** | Auto-bidding for conversions (fallback: max CPC $1-2) | Learning phase expected first 24 hours |
| **Conversion Tracking** | Reddit Pixel on landing page (purchase event) | Goal: 5-10% CTR in niche communities |

**Ad Variations:**

| Variation | Headline | Body Copy | CTA | Visual |
|-----------|----------|-----------|-----|--------|
| **Primary** | "Ditch $120/mo subs. Plan 90 days for $34." | Tired of expensive tools? Notion Content Calendar Pro gives monthly/weekly views, multichannel support (YouTube, IG, TikTok), idea pipelines. One-time $34. Creators love it: "Perfect structure!" | **Get It Now** | Calendar interface screenshot + testimonial overlay |
| **Secondary** | "Content creators: 90-day planner under $40" | Freelance writers & managers: Seamless idea capture to publish. No recurring fees. Pro version includes channels, campaigns, video tutorials. | **Plan Free → Buy Pro** | 15-second video demo of idea-to-publish flow |

---

### TWITTER/X ADS ($125 total, ~$42/day)

| Element | Specification | Notes |
|---------|---------------|-------|
| **Ad Type** | Promoted tweet with website card | Drives traffic to landing page |
| **Budget** | $125 lifetime (3-day run = ~$42/day) | Standard delivery for even pacing |
| **Targeting** | Keywords: "Notion template," "content calendar," "freelance writer tools"; interests: content creation, social media marketing, Notion; followers of @NotionHQ; age 25-45 | Custom audience from similar template buyers if available |
| **Bidding** | Automatic (X optimizes) or manual CPC $0.50-$2 | Goal: $1-2 CPC, 2-5 conversions over 3 days |
| **Conversion Tracking** | Twitter Pixel on landing page (purchase event) | Track views, clicks, conversions |

**Tweet Variations:**

| Variation | Copy | CTA | Visual |
|-----------|------|-----|--------|
| **Primary** | "Plan 90 days of content without $120/mo. Notion Content Calendar Pro - $34 one-time. Monthly/weekly views, multichannel (IG/TikTok/YouTube), idea-to-publish flow. 'Ultimate tool!' #ContentCalendar" | **Buy $34** → Link | Calendar interface + "Save vs. subs" badge |
| **Secondary** | "Freelancers: Stop overpaying for calendars. $34 Notion Pro = 90 days planned. Channels, campaigns, video guide. Beats free templates. #FreelanceWriters #Notion" | **Grab It** → Link | Carousel showing before/after (chaos → organized) |

---

## 4. CONTENT NEEDED (Hand off to Builder)

### READY TO GO:
✅ **Ad Copy** – Both Reddit and Twitter variations provided above
✅ **Call-to-Action** – "Get It Now," "Buy $34," "Grab It" (platform-native options)
✅ **Destination URL** – Landing page (assumes bennybuildsit.gumroad.com/l/notion-content-calendar-pro or equivalent is live)
✅ **Conversion Tracking Setup** – Pixel installation instructions (standard for both platforms)

### NEEDS TO BE BUILT:
🔨 **Landing Page** (if not already optimized):
- Headline: "Notion Content Calendar Pro – Plan 90 Days for $34"
- Subheading: "One-time purchase. No monthly fees. Everything you need to organize content across YouTube, Instagram, TikTok, and blogs."
- Above-fold: Clear value prop (cost comparison: "$120/month tools vs. $34 one-time")
- Features section: Monthly/weekly views, multichannel support, idea pipelines, video tutorials
- Social proof: Customer testimonials, number of sales, reviews
- Comparison table: Content Calendar Pro vs. Notion Plus ($10/mo), Asana ($10-25/mo), Buffer ($5-35/mo)
- Clear purchase button (links to Gumroad)
- FAQ: "Will this work for my niche?" "Can I customize it?" "What if I need help?"

🔨 **Ad Creative Assets:**
- **Reddit Image** (1200x628px): Calendar interface screenshot with testimonial quote overlay. Style: Clean, professional, Notion-native aesthetic
- **Reddit Video** (optional, 15-30s): Screen recording of idea-to-publish workflow in the template
- **Twitter Image** (1200x675px): "Save vs. subs" comparison graphic showing $120/month vs. $34 one-time
- **Twitter Carousel** (optional): Before/after (chaos → organized calendar)

🔨 **Conversion Tracking Implementation:**
- Reddit Pixel: Install on landing page (paste code in `<head>` section), define "Purchase" conversion event
- Twitter Pixel: Install on landing page, create conversion event for purchases
- Gumroad Integration: Verify Gumroad's native pixel/event tracking is connected to ad platforms (if available)
- Testing: Verify pixels fire correctly using platform debuggers

---

## 5. TIMELINE

| Phase | Timeline | Action |
|-------|----------|--------|
| **Pre-Launch** | Day 0 | Verify landing page is live and tested; install conversion pixels; create Reddit and Twitter ad accounts (if needed) |
| **Campaign Setup** | Day 0 | Create Reddit ad group (2 subreddits, 2 ad variations); create Twitter campaign (2 tweet variations); set $125 budget per platform |
| **Creative Upload** | Day 0 | Upload images/videos to both platforms; write copy; set targeting (age 25-45, interests, keywords) |
| **Review & Launch** | Day 0 (evening) | Final compliance check; launch both campaigns simultaneously |
| **Day 1 Monitoring** | Day 1 | Track impressions, clicks, CTR, CPC, conversions. Check for technical issues (pixel fires, ad approvals). Pause underperformers if CTR <0.5% |
| **Day 2 Optimization** | Day 2 | Adjust bids if CPC >$2; increase budget on high-performers; monitor conversion data |
| **Day 3 Final Run** | Day 3 | Collect final conversion data; prepare comparison analysis vs. CRM template campaign |
| **Post-Campaign Analysis** | Day 4 | Calculate ROAS, CAC, conversion rate; compare Reddit vs. Twitter performance; document learnings |

---

## 6. SUCCESS METRICS

### PRIMARY METRICS (Track daily):
- **Impressions** – Total ad views (diagnostic for reach)
- **Clicks** – Total clicks to landing page (goal: 50-100 clicks across both platforms)
- **Click-Through Rate (CTR)** – Clicks ÷ impressions (target: >1% for niche communities; Reddit typically 2-5%, Twitter 0.5-2%)
- **Cost Per Click (CPC)** – Total spend ÷ clicks (target: <$2; benchmark for these audiences is $0.50-$1.50)
- **Conversions** – Number of $34 purchases (goal: 3-8 conversions over 3 days)
- **Cost Per Acquisition (CAC)** – Total spend ÷ conversions (target: <$20 to maintain 1.7x ROAS)
- **Return on Ad Spend (ROAS)** – Revenue ÷ ad spend (target: >1.5:1 to validate viability)

### SECONDARY METRICS:
- **Conversion Rate** – Conversions ÷ clicks (diagnostic for landing page quality; target: 3-8%)
- **Revenue** – Total sales from ads (goal: $100-270 to validate demand)
- **Platform Comparison** – Which platform (Reddit vs. Twitter) has better ROAS? Which audience converts better?

### DECISION THRESHOLDS:
- **PAUSE** if CAC >$25 or ROAS <1:1 (unprofitable)
- **OPTIMIZE** if CTR <0.5% (creative not resonating; test variation)
- **SCALE** if ROAS >2:1 and CAC <$15 (increase budget to $500-1000/week)
- **COMPARE TO CRM TEMPLATE** – Is Content Calendar Pro more or less profitable than CRM template? Which should get more budget going forward?

---

## WHAT'S READY VS. WHAT NEEDS BUILDING

| Component | Status | Owner |
|-----------|--------|-------|
| Ad copy (Reddit + Twitter) | ✅ Ready | N/A |
| Campaign structure | ✅ Ready | Marketing (platform setup) |
| Targeting parameters | ✅ Ready | Marketing |
| Ad creative images | 🔨 Needs building | Designer |
| Ad creative video (optional) | 🔨 Needs building | Video producer |
| Landing page | ⚠️ Depends | Builder (if not already live) |
| Conversion pixels | 🔨 Needs building | Developer |
| Gumroad integration | ⚠️ Depends | Developer (verify connection) |

---

## CRITICAL NOTES FOR THIS TEST

**Price Discrepancy Alert:** Search results show $19 one-time pricing on Gumroad, but your brief specifies $34. Confirm which is correct before launch—this affects messaging credibility and ROAS calculations.

**3-Day Window:** This is a short test. You'll get directional data (which platform/audience resonates) but not statistical significance. Plan to extend winners to 7-14 days for better conversion data.

**Comparison Baseline:** You're running this p