# Marketing - Campaign Plan

**Date:** 2026-03-12T11:24:22

---

This is a real brief with real structure.

You've given me:
- Objective: Launch 'Done-for-you setup' ad test ($400 budget)
- Platform: Facebook/Instagram
- Offer: $199 setup service
- Audience: Identified customer profile (freelance writers, solopreneurs)
- Creatives: 3 variations from creative director
- Tracking: UTM parameters + daily dashboard

The search results give me operational guidance for Meta Ads Manager setup.

**I can execute this.**

---

## CAMPAIGN PLAN: Done-for-You Setup Service – $400 Meta Test

---

## 1. CAMPAIGN CONCEPT
**"We handle the setup. You handle the business."** – Position the $199 setup service as the friction remover for freelancers/solopreneurs who bought templates but never implemented them.

---

## 2. TARGET AUDIENCE
**Primary:** Freelance writers and solopreneurs (ages 25-55) who:
- Have purchased or expressed interest in productivity/business templates
- Work independently (no team)
- Struggle with operational setup and implementation
- Are active on Instagram (visual, quick-scroll format)
- Income: $30k-$150k annually
- Pain point: "I bought the template but don't have time/expertise to set it up"

**Audience Targeting Parameters (Meta):**
- Interest stacks: "Freelance writing" + "Solopreneur" + "Content marketing" + "Small business"
- Age: 25-55
- Devices: Mobile-preferred
- Placements: Instagram Feeds, Stories, Reels (prioritize vertical)
- Lookalike: Create lookalike from existing customer list (if available)
- Exclusions: Recent converters (past 30 days)

---

## 3. CHANNELS & TACTICS

### META ADS (Facebook/Instagram) – $400 Total Budget

| Element | Specification | Rationale |
|---------|---------------|-----------|
| **Platform** | Instagram primary, Facebook secondary (Advantage+ auto-placement) | Freelancers/solopreneurs spend more time on Instagram; visual format suits service offer |
| **Campaign Objective** | Conversions (optimize for booking form submits) | Direct optimization for landing page conversions |
| **Budget** | $400 total (~$57/day for 7 days) | Low-budget test; use Campaign Budget Optimization (CBO) for daily optimization |
| **Ad Format** | 3 variations (single image/video or carousel) from creative director | A/B test to identify highest-converting creative |
| **Bidding** | Lowest cost (automatic) | Let Meta optimize for conversions within budget |
| **Tracking** | Meta Pixel + Conversions API + UTM parameters | Cross-platform attribution (Meta + Google Analytics) |

**Ad Set Configuration:**
- **Name:** "Freelance Writers & Solopreneurs - $400 Test"
- **Audience:** Freelance writers/solopreneurs (interest-stacked), age 25-55, mobile-preferred
- **Placements:** Advantage+ (auto: Instagram Feeds, Stories, Reels, Facebook Feeds, Messenger)
- **Optimization:** Conversions (booking form submits)
- **Tracking:** Pixel firing on form submit event

**Ad Level (3 Variations):**

| Ad Variation | Headline | Primary Text | CTA | Visual |
|--------------|----------|--------------|-----|--------|
| **Variation 1** | "Done-for-You Setup – Just $199" | "You bought the template. We'll set it up. 2-hour setup call + full implementation. Done." | Book Now | [Creative from director - Variation 1] |
| **Variation 2** | "Stop Procrastinating on Setup" | "Your template is sitting unused. We'll implement it for you in one call. $199. Done." | Get Setup | [Creative from director - Variation 2] |
| **Variation 3** | "Template Setup in 2 Hours" | "Freelancers: Stop wasting time on setup. We handle it. You handle clients. $199 flat." | Schedule Call | [Creative from director - Variation 3] |

**UTM Parameters (append to landing page URL):**
```
https://yourlandingpage.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=doneforyou_setup_test&utm_content=variation1
https://yourlandingpage.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=doneforyou_setup_test&utm_content=variation2
https://yourlandingpage.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=doneforyou_setup_test&utm_content=variation3
```

---

## 4. CONTENT NEEDED (Hand off to Builder)

### READY TO GO:
✅ **Ad copy variations** – Provided above (3 headlines + primary text)
✅ **UTM parameters** – Formatted above
✅ **Targeting parameters** – Specified in audience section
✅ **Campaign structure** – Meta Ads Manager setup guide provided in search results

### NEEDS TO BE BUILT:

🔨 **Landing Page** (if not already built):
- Headline: "Done-for-You Setup Service – $199"
- Subheading: "We'll implement your template in one call. You focus on clients."
- Above-fold: Clear value prop + service overview (what's included in the 2-hour setup call)
- **Service breakdown:**
  - 30-min discovery call (understand your workflow)
  - 90-min implementation (set up template + integrations)
  - 30-min training (how to use it going forward)
- Booking form: Name, email, phone, preferred time slot (Calendly embed or Acuity Scheduling)
- Social proof: 2-3 testimonials from freelancers who've used the service
- FAQ: "What's included?" "How long does it take?" "Can I customize it?" "What if I need ongoing support?"
- Trust signals: Money-back guarantee, no credit card required to book, free 15-min consultation option
- CTA button: "Book Your Setup Call" (prominent, above-fold and mid-page)

🔨 **Meta Pixel Setup:**
- Install Meta Pixel code on landing page (via Meta Business Manager)
- Configure conversion events:
  - "Lead" event: Fires when booking form is submitted
  - "Purchase" event: Fires when booking is confirmed (optional, if you have post-booking confirmation page)
- Test Pixel firing using Meta Pixel Helper browser extension
- Enable Conversions API for backup tracking (if available in your tech stack)

🔨 **Google Analytics Setup:**
- Install GA4 on landing page
- Create custom report for UTM source/medium/campaign/content
- Set up conversion goal: "Booking Form Submit"
- Create dashboard showing:
  - Clicks from Facebook
  - Conversion rate by variation
  - Cost per conversion by variation

🔨 **Daily Tracking Dashboard:**
- **Option A (Simple):** Google Sheets pulling data from:
  - Meta Ads Manager (CTR, CPC, spend, conversions)
  - Google Analytics (UTM conversions by variation)
  - Calendly (booking confirmations)
- **Option B (Automated):** Zapier + Google Sheets (auto-log conversions from Calendly → Sheets)
- **Columns to track:**
  - Date
  - Variation (1/2/3)
  - Impressions
  - Clicks
  - CTR
  - CPC
  - Spend
  - Conversions (form submits)
  - Cost per conversion
  - Notes (creative performance, audience response)

🔨 **Ad Creatives (3 Variations):**
- Provided by creative director (vertical video/Reels for Stories/Feeds, square images for feeds)
- Ensure: High-res, mobile-optimized, captions included, safe-zone messaging (no text in outer edges)
- Format: 1080x1350px (vertical) or 1080x1080px (square)

---

## 5. TIMELINE

| Phase | Timeline | Action |
|-------|----------|--------|
| **Pre-Launch** | Day 0 (Today) | Finalize landing page; set up Meta Pixel + GA4; create Calendly booking link; prepare 3 ad creatives from director |
| **Setup** | Day 0 (afternoon) | Create Meta Ads Manager campaign; set targeting; upload 3 ad variations; set UTM parameters; test landing page links |
| **Review** | Day 0 (evening) | Final compliance check; verify Pixel firing; test booking form; review ad preview across placements |
| **Launch** | Day 1 (morning) | Publish campaign (status: Active); set to run at midnight for daily optimization; $400 budget (~$57/day for 7 days) |
| **Daily Monitoring** | Days 1-7 | Check dashboard daily (EOD): CTR, CPC, conversion rate, cost per conversion; pause underperformers if CTR <0.5% after 48 hours |
| **Mid-Test Review** | Day 4 | Evaluate: Which variation has best CTR? Best conversion rate? Pause lowest performer if clear winner emerges |
| **Final Analysis** | Day 8 | Consolidate 7-day results; calculate cost per conversion; recommend scale or pivot |

---

## 6. SUCCESS METRICS

### PRIMARY METRICS (Track Daily):

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| **Impressions** | 8,000-15,000 over 7 days | Diagnostic for reach; shows audience size |
| **Clicks** | 80-200 over 7 days | Traffic to landing page |
| **Click-Through Rate (CTR)** | >1% | Indicates creative resonance; benchmark for service ads is 0.5-2% |
| **Cost Per Click (CPC)** | <$2 | Efficiency metric; Meta average for service ads is $0.75-$2.00 |
| **Conversions (Form Submits)** | 5-15 over 7 days | Actual bookings/leads |
| **Cost Per Conversion (CPA)** | <$50 | Profitability threshold; at $199 service, need CPA <$50 for 4:1 ROAS minimum |
| **Conversion Rate** | 5-10% (clicks → conversions) | Quality of landing page + audience match |

### SECONDARY METRICS:

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| **Cost Per Mille (CPM)** | $2-8 | Audience quality; lower CPM = better audience match |
| **Engagement Rate** | >2% (likes/shares/comments) | Indicates algorithm favor; higher engagement = lower costs over time |
| **Variation Performance** | Identify top 1-2 performers | Which creative resonates most? |
| **Platform Performance** | Compare Instagram vs. Facebook | Which placement drives better conversions? |
| **Booking Confirmation Rate** | 70-80% (booked calls that happen) | Quality of leads; no-shows are normal but trackable |

### DECISION THRESHOLDS:

| Scenario | Action |
|----------|--------|
| **CTR >1.5% + CPA <$35** | SCALE – Double budget to $800 for next week |
| **CTR 0.8-1.5% + CPA $35-50** | OPTIMIZE – Pause lowest performer; test new variation |
| **CTR <0.5% + CPA >$60** | PAUSE – Creative not resonating; revisit messaging |
| **0 conversions after 48 hours** | TROUBLESHOOT – Check Pixel firing, landing page form, audience targeting |
| **5+ conversions by Day 3** | WINNING SIGNAL – Maintain spend; prepare to scale |

---

## CRITICAL NOTES FOR THIS TEST

**The Real Opportunity:** This test validates whether freelancers/solopreneurs wil