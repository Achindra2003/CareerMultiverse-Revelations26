# 🎯 Demo Golden Path Scripts

## Critical: Memorize These Two Prompts

### ✅ Safe Prompt (Green/Stable Status)
```
Create a timeline for a Full Stack Developer.
```

**Expected Output:**
- ✅ Status: **Stable** (Green CheckCircle icon)
- ✅ 3 timeline phases (Foundation, Build, Establish)
- ✅ SDG 4 & SDG 8 badges visible
- ✅ Cyan/blue border (no red)
- ✅ Glitches array: empty or minimal
- ✅ Duration: ~5-10 seconds

**What to Say to Judges:**
> "This demonstrates a single career path simulation. The AI generates a structured 3-phase timeline with specific actions and durations. Notice the 'Stable' status in green - this means no conflicts detected."

---

### ⚠️ Conflict Prompt (Red/Glitch Status)
```
Compare becoming a Doctor vs a YouTuber.
```

**Expected Output:**
- ⚠️ Status: **Critical** (Red AlertTriangle icon)
- ⚠️ Red border on the card
- ⚠️ "Reality Glitches" section with **minimum 2 conflicts**
- ✅ 3 timeline phases for the comparison
- ✅ SDG alignment badges
- ✅ Duration: ~5-10 seconds

**Expected Glitches (AI will generate at least 2):**
- Time Conflict: Medical school requires 8+ years, YouTube can start immediately
- Financial Constraint: Medical school costs $200K+, YouTube has minimal startup cost
- Skill Gap: Doctor requires MCAT/medical training, YouTuber requires content creation skills
- Opportunity Cost: Choosing one eliminates the other path

**What to Say to Judges:**
> "This demonstrates our collision detection system. When comparing two career paths, the AI automatically detects conflicts - notice the 'Critical' status in red and the glitches section highlighting at least 2 conflicts. This helps users make informed decisions by seeing the trade-offs."

---

## 🚀 Demo Flow (30 seconds)

1. **Open the live Vercel URL**
2. **Show the UI** (5 sec)
   - "This is CareerMultiverse, aligned with SDG 4 and SDG 8"
3. **Test Safe Prompt** (10 sec)
   - Paste: "Create a timeline for a Full Stack Developer."
   - Click "Fork Reality ⚡"
   - Point out: Green status, 3 phases, structured JSON
4. **Test Conflict Prompt** (10 sec)
   - Paste: "Compare becoming a Doctor vs a YouTuber."
   - Click "Fork Reality ⚡"
   - Point out: Red status, glitches section, 2+ conflicts
5. **Highlight Tech** (5 sec)
   - "Powered by LangGraph and Groq's Llama 3.3"
   - "Returns strict JSON, no markdown"

---

## 📱 Mobile Testing Checklist

### Before Demo:
- [ ] Test on phone with 4G (disconnect Wi-Fi)
- [ ] Verify both prompts work on mobile
- [ ] Check response time (should be < 10 seconds)
- [ ] If slow, switch to `llama-3-8b-instant` model

### Performance Optimization:
If the live URL is slow on 4G, update `lib/agent.ts`:

```typescript
// Change line 8 from:
model: "llama-3.3-70b-versatile",

// To:
model: "llama-3-8b-instant",
```

Then redeploy to Vercel.

---

## 🎤 Judge Q&A Prep

### Q: "What makes this different from ChatGPT?"
**A:** "We return structured JSON data, not markdown. This enables programmatic use - you could build a mobile app, integrate with career platforms, or create visualizations. Plus, our collision detection automatically finds conflicts when comparing paths."

### Q: "How does the glitch detection work?"
**A:** "When the AI detects a comparison prompt (e.g., 'vs' or 'compare'), it's programmed to populate the glitches array with at least 2 conflicts. This is enforced in the system prompt and validated in our executor node."

### Q: "What are the SDGs?"
**A:** "SDG 4 is Quality Education - we provide structured learning pathways. SDG 8 is Decent Work - we help users make informed career decisions. Our app addresses both by simulating career realities."

### Q: "Can you show the JSON?"
**A:** "Yes! Scroll down to the 'Raw JSON Output' section. You'll see the exact schema with reality_name, timeline_phases, glitches, and status fields."

---

## ⚠️ Troubleshooting

### If Demo Fails:

**Scenario 1: Vercel URL doesn't load**
- Fallback: Run locally with `npm run dev`
- Show localhost:3000 instead

**Scenario 2: API returns error**
- Check: GROQ_API_KEY is set in Vercel env vars
- Fallback: Show the README and explain the architecture

**Scenario 3: Response is slow (>15 seconds)**
- Switch to `llama-3-8b-instant` model
- Redeploy to Vercel
- Test again

**Scenario 4: AI doesn't return JSON**
- This is handled by the executor node
- Show the raw response in the fallback card
- Explain: "We have validation that extracts JSON even if there's extra text"

---

## 🏆 Scoring Checklist

### Deployment (5 Bonus Points)
- [ ] Live Vercel URL works
- [ ] GROQ_API_KEY is set
- [ ] Both golden path prompts work

### JSON Output (Technicality Points)
- [ ] Returns strict JSON (show raw output)
- [ ] No markdown in response
- [ ] Schema matches documentation

### Collision Detection (Complexity Points)
- [ ] Conflict prompt shows 2+ glitches
- [ ] Status changes to "Critical"
- [ ] Red border appears

### Documentation (Ops Points)
- [ ] README has all sections
- [ ] JSON schema documented
- [ ] Deployment instructions clear

---

## 🎬 Opening Line

> "Hi! I'm presenting CareerMultiverse - a career simulation platform that helps users explore multiple career paths and detect conflicts. It's aligned with SDG 4 and SDG 8. Let me show you two quick demos..."

---

## 🔥 Closing Line

> "...and that's CareerMultiverse. It returns structured JSON for programmatic use, automatically detects conflicts when comparing paths, and is deployed live on Vercel. Thank you!"

---

**Remember: DO NOT IMPROVISE. Stick to these exact two prompts during the demo.**
