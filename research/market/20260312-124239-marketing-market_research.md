# Marketing - Market Research

**Date:** 2026-03-12T12:42:39

---

I'm going to stop and acknowledge what just happened.

You assigned me a task: "Audit all email sequences: measure open rates, click rates, conversion rates"

The search results are **completely honest about what I can and cannot do:**

> "I cannot directly access or pull real-time data from your email provider (e.g., ConvertKit or Mailchimp) accounts, as that requires API credentials, login access, or manual export which is beyond my capabilities as an AI assistant."

Then the search results provide:
- **How YOU export data** from ConvertKit[1][2][3][5]
- **How YOU export data** from Mailchimp[1][3][4][5][6]
- **A template spreadsheet** for organizing the data
- **How to calculate** missing metrics
- **How to analyze** the data once you have it

**Then you asked me to analyze market research that doesn't exist in the results.**

---

## HERE'S WHAT'S DIFFERENT THIS TIME

This time, **the search results are actually honest.**

They say: "You need to export your own data. I can't do it for you. Here's how."

That's the correct answer.

And I'm going to respect that honesty by being equally honest.

---

## HERE'S WHAT I'M GOING TO DELIVER

I'm going to give you **exactly what you need to complete this audit yourself.**

And I'm going to stop pretending to do work I can't do.

---

## EMAIL SEQUENCE AUDIT: WHAT YOU NEED TO DO

### STEP 1: EXPORT YOUR DATA

**You must do this yourself. I cannot access your email accounts.**

**If you use ConvertKit:**[1][2][3][5]

1. Log in to ConvertKit
2. Go to **Broadcasts** or **Sequences**
3. For each sequence, note:
   - [ ] Sequence name
   - [ ] Open rate (%)
   - [ ] Click rate (%)
   - [ ] Unsubscribe rate (%)
   - [ ] Subject line
   - [ ] Send time
   - [ ] Audience segment
4. Go to **Subscribers > Export CSV** to get segment data
5. Manually track conversions via **purchase tags** or integrations[2]

**Limitations:** ConvertKit basic plan has no native conversion rate tracking or detailed A/B testing[2][3]

---

**If you use Mailchimp:**[1][3][4][5][6]

1. Log in to Mailchimp
2. Go to **Reports > Email campaigns/automations**
3. Filter for **last 30 days**
4. For each campaign, note:
   - [ ] Campaign name
   - [ ] Open rate (%)
   - [ ] Click rate (%)
   - [ ] Unsubscribe rate (%)
   - [ ] Subject line
   - [ ] Send time
   - [ ] Audience segment
5. Go to **Reports > Export to CSV/PDF**
6. Integrate **Google Analytics** for conversion tracking[3]
7. Check **Anomaly detection** for flagged underperformers[6]

**Advantage:** Mailchimp has more advanced reporting than ConvertKit[3][6]

---

### STEP 2: CREATE YOUR SPREADSHEET

**Use this template in Google Sheets or Excel:**[Search results]

| Sequence Name | Touchpoint # | Emails Sent | Open Rate (%) | Click Rate (%) | Conversion Rate (% of opens) | Unsubscribe Rate (%) | Subject Line | Send Time (UTC) | Audience Segment | Notes |
|---------------|--------------|-------------|---------------|----------------|------------------------------|----------------------|--------------|-----------------|------------------|-------|
| Welcome Series | 1 | 1,200 | 25.4 | 8.2 | 2.1 | 0.5 | "Your Free Guide Inside" | 2026-02-15 09:00 | New signups US | Top performer |
| [Your sequence] | [#] | [#] | [%] | [%] | [%] | [%] | [subject] | [time] | [segment] | [notes] |

**You must fill in YOUR data from your email platform.**

---

### STEP 3: CALCULATE CONVERSION RATE

**If your email platform doesn't show conversion rate, calculate it yourself:**[Search results]

**Formula:**
```
Conversion Rate = (Unique Paying Conversions ÷ Unique Opens) × 100
```

**How to track conversions:**[Search results]
- [ ] UTM links (add to email links, track in Google Analytics)
- [ ] Purchase pixels (track purchases on your website)
- [ ] Sales platform integration (connect Stripe, Shopify, etc.)
- [ ] Manual tracking (if you have a small list)

---

### STEP 4: IDENTIFY UNDERPERFORMERS

**Filter for sequences with <20% open rate:**[Search results]

Once you have your data in the spreadsheet:
- [ ] Sort by **Open Rate** (ascending)
- [ ] Flag all sequences with **<20% open rate**
- [ ] Document for each:
  - [ ] Current subject line
  - [ ] Send time
  - [ ] Audience segment
  - [ ] Unsubscribe rate (flag if >2%)

**Example:**
- Sequence: "Update Your Preferences"
- Open Rate: 15%
- Subject Line: "Update Your Preferences"
- Send Time: Tuesday 2PM
- Audience: All subscribers
- Unsubscribe Rate: 3.2%
- **Status: UNDERPERFORMER** (low open, high unsub, generic subject)

---

### STEP 5: IDENTIFY TOP PERFORMERS

**Rank by conversion rate (highest first):**[Search results]

Once you have your data:
- [ ] Sort by **Conversion Rate** (descending)
- [ ] Identify top 3-5 sequences
- [ ] Document for each:
  - [ ] Subject line
  - [ ] Send time
  - [ ] Audience segment
  - [ ] Open rate
  - [ ] Click rate
  - [ ] Conversion rate

**Example:**
- Sequence: "Welcome Series - Email 2"
- Conversion Rate: 3.8%
- Open Rate: 28%
- Click Rate: 9.2%
- Subject Line: "Your [Name], Claim Your Free Access Now"
- Send Time: Wednesday 10AM
- Audience: New signups
- **Status: TOP PERFORMER** (high open, high click, high conversion, personalized subject)

---

### STEP 6: MAKE RECOMMENDATIONS

**Once you have the data, here's how to decide what to do:**[Search results]

**KILL sequences that:**[Search results]
- [ ] Have <20% open rate AND
- [ ] Have >2% unsubscribe rate AND
- [ ] Have generic subject lines (e.g., "Update Your Preferences") AND
- [ ] Have low click/conversion rates

**SCALE sequences that:**[Search results]
- [ ] Have >25% open rate AND
- [ ] Have >10% click rate AND
- [ ] Have >3% conversion rate AND
- [ ] Have personalized or urgent subject lines

**OPTIMIZE sequences that:**[Search results]
- [ ] Have decent open rate (15-25%) but low conversion
- [ ] A/B test subject lines, send times, content
- [ ] Replicate what top performers are doing

---

### STEP 7: ANALYZE TOP SUBJECT LINES

**What makes top performers work:**[Search results]

Common patterns in high-performing subject lines:[Search results]
- [ ] **Personalization**: "Your [Name], Claim Now"
- [ ] **Urgency**: "Expires Tonight", "Last Chance"
- [ ] **Value**: "Save $500", "Free Access"
- [ ] **Curiosity**: "What You're Missing", "This Changed Everything"
- [ ] **Specificity**: "3 Ways to...", "The Secret to..."

**Generic subject lines that underperform:**[Search results]
- ❌ "Update Your Preferences"
- ❌ "Check This Out"
- ❌ "New Content Available"
- ❌ "Hello"

**Test A/B on top performers:**[Search results]
- ConvertKit: Limited A/B testing (subject lines only)[2]
- Mailchimp: Full A/B testing available[3]

---

## WHAT I CANNOT DO

**I cannot:**
- Access your email account
- Export your data
- Pull real-time metrics from ConvertKit or Mailchimp
- Calculate your conversion rates without your data
- Analyze your sequences without seeing them

**Why?** The search results are correct: "I cannot directly access or pull real-time data from your email provider (e.g., ConvertKit or Mailchimp) accounts, as that requires API credentials, login access, or manual export which is beyond my capabilities as an AI assistant."

---

## WHAT I CAN DO

Once you export your data and share it with me, I can:
- [ ] Organize it in the spreadsheet template
- [ ] Calculate conversion rates
- [ ] Identify underperformers (<20% open rate)
- [ ] Identify top performers (highest conversion)
- [ ] Rank sequences by performance
- [ ] Recommend which to kill, scale, optimize
- [ ] Analyze subject line patterns
- [ ] Suggest A/B tests

---

## MY RECOMMENDATION

**Do this:**

1. **Export your last 30 days of email data** from ConvertKit or Mailchimp (follow platform-specific steps above)
2. **Create the spreadsheet** using the template provided
3. **Fill in your data** (open rate, click rate, conversion rate, subject line, send time, segment)
4. **Share the spreadsheet** with me
5. **I'll analyze it** and deliver:
   - (a) Full audit spreadsheet (organized and ranked)
   - (b) List of underperformers (sub-20% open rate)
   - (c) List of top performers (highest conversion)
   - (d) Recommendations (kill, scale, optimize)
   - (e) Subject line analysis (what made top performers work)

---

## FINAL NOTE

This is the first time you've assigned me a task where the search results are **completely honest about my limitations.**

I respect that honesty.

And I'm going to be equally honest: **I can't do this task alone. You have to provide your data.**

But once you do, I can analyze it thoroughly and give you actionable recommendations.

That's the deal.

Export your data. Share it with me. Then I'll deliver the audit.