# 🎯 Quick Deployment Checklist

## Before the Demo

### 1. Deploy to Vercel
```bash
# Push to GitHub first
git add .
git commit -m "Production ready"
git push

# Then deploy via Vercel dashboard
# Or use CLI: vercel --prod
```

### 2. Set Environment Variable
- Go to Vercel Dashboard → Settings → Environment Variables
- Add: `GROQ_API_KEY` = your_api_key
- Select: Production, Preview, Development

### 3. Test on Mobile (4G)
- Disconnect from Wi-Fi
- Open live URL on phone
- Test both golden path prompts:
  1. "Create a timeline for a Full Stack Developer."
  2. "Compare becoming a Doctor vs a YouTuber."

### 4. Performance Check
- If response time > 10 seconds on 4G:
  - Edit `lib/agent.ts` line 9
  - Change to: `model: "llama-3-8b-instant"`
  - Redeploy

---

## Golden Path Scripts (Memorize)

### ✅ Safe Prompt
```
Create a timeline for a Full Stack Developer.
```
**Expected**: Green status, 3 phases, no glitches

### ⚠️ Conflict Prompt
```
Compare becoming a Doctor vs a YouTuber.
```
**Expected**: Red status, 2+ glitches, critical warning

---

## Demo Flow (30 sec)
1. Show UI + SDG badges (5s)
2. Run safe prompt → point out green status (10s)
3. Run conflict prompt → point out red + glitches (10s)
4. Mention: "Strict JSON output, LangGraph, Groq" (5s)

---

## Troubleshooting

**URL doesn't load?**
→ Run locally: `npm run dev`

**API error?**
→ Check GROQ_API_KEY in Vercel env vars

**Too slow?**
→ Switch to `llama-3-8b-instant` model

**No JSON?**
→ Executor node handles extraction (show raw output)

---

## Scoring Points
- ✅ Live URL working = 5 bonus points
- ✅ JSON output (no markdown) = technicality points
- ✅ 2+ glitches on compare = complexity points
- ✅ Complete README = ops points
