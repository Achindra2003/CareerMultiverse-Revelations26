# 🌌 CareerMultiverse: Reality Architect

> **Hackathon Project**: Problem Statement 5 - Reality Management  
> **SDG Alignment**: SDG 4 (Quality Education) & SDG 8 (Decent Work)

A cutting-edge AI-powered career simulation platform that helps users explore multiple career realities, detect conflicts when comparing paths, and make informed decisions about their professional future.

---

## 🎯 Overview

CareerMultiverse uses advanced AI to simulate career paths as "realities" that can be **forked** (explored individually) or **merged** (compared for conflicts). The system detects "reality glitches" - conflicts like time constraints, skill gaps, and opportunity costs - when comparing multiple career paths.

### Key Features

- **🔀 Reality Forking**: Simulate individual career paths with detailed 3-phase timelines
- **⚔️ Reality Merging**: Compare multiple career paths and detect conflicts
- **⚠️ Glitch Detection**: Automatic identification of at least 2 conflicts when comparing paths
- **📊 Structured Data**: JSON-based output for reliable, parseable career insights
- **🎨 Modern UI**: Dark-mode futuristic interface with real-time status indicators

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **shadcn/ui** - Accessible component library
- **Lucide React** - Icon system

### Backend & AI
- **LangGraph** - Stateful AI agent orchestration
- **Groq** - High-performance LLM inference
- **Llama 3.3 70B** - Advanced language model
- **@langchain/core** - LangChain framework

### Infrastructure
- **Vercel** - Deployment platform
- **Node.js** - Runtime environment

---

## 🚀 How to Run

### Prerequisites
- Node.js 20+ installed
- Groq API key ([Get one here](https://console.groq.com))

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd career-multiverse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

---

## 🌐 Deployment on Vercel

### Quick Deploy

1. **Connect your repository to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Vercel will auto-detect Next.js

2. **Add environment variables**
   - In Vercel dashboard: Settings → Environment Variables
   - Add `GROQ_API_KEY` with your API key
   - Select all environments (Production, Preview, Development)

3. **Deploy**
   - Click "Deploy"
   - Your app will be live in ~2 minutes

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## 📋 JSON Output Schema

The Career Reality Architect returns structured JSON data:

```json
{
  "reality_name": "AI Startup Founder Path",
  "sdg_alignment": ["SDG 4", "SDG 8"],
  "timeline_phases": [
    {
      "phase": "Foundation",
      "action": "Learn Python and ML fundamentals",
      "duration": "6 months"
    },
    {
      "phase": "Build",
      "action": "Build MVP and get first customers",
      "duration": "12 months"
    },
    {
      "phase": "Establish",
      "action": "Scale to 100 customers and raise funding",
      "duration": "18 months"
    }
  ],
  "glitches": [
    "Financial Constraint: Need runway for 2+ years",
    "Skill Gap: Requires advanced ML knowledge"
  ],
  "status": "Stable"
}
```

### Status Types
- **Stable**: Single career path exploration
- **Critical**: Comparing multiple paths (triggers glitch detection)

---

## 🎓 SDG Alignment

### SDG 4: Quality Education
- Provides structured learning pathways
- Identifies skill gaps and educational requirements
- Offers phase-by-phase career development plans

### SDG 8: Decent Work and Economic Growth
- Helps users make informed career decisions
- Identifies sustainable career paths
- Highlights potential conflicts and risks

---

## 🧪 Testing the App

### Test Case 1: Fork Reality (Single Path)
**Input**: "I want to become a pilot"  
**Expected**: Stable status, 3-phase timeline, minimal/no glitches

### Test Case 2: Merge Reality (Comparison)
**Input**: "Compare MBA vs becoming a pilot"  
**Expected**: Critical status, 2+ glitches, timelines for both paths

### Test Case 3: Complex Simulation
**Input**: "Simulate a reality where I drop out and build an AI startup"  
**Expected**: Detailed timeline with specific actions and durations

---

## 📁 Project Structure

```
career-multiverse/
├── app/
│   ├── api/agent/route.ts    # API endpoint for agent
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main UI component
├── components/ui/             # shadcn/ui components
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── scroll-area.tsx
│   └── separator.tsx
├── lib/
│   ├── agent.ts               # LangGraph agent logic
│   └── utils.ts               # Utility functions
├── .env.local                 # Environment variables (gitignored)
├── .env.example               # Example env file
└── package.json               # Dependencies
```

---

## 🔒 Security & Privacy

- ✅ No user data is stored or logged
- ✅ API keys are environment variables only
- ✅ No client-side data persistence
- ✅ Secure API routes with validation

---

## 🏆 Hackathon Bonus Points

- ✅ **Deployment**: Live on Vercel with environment variables configured
- ✅ **JSON Output**: Strict schema enforcement, no markdown
- ✅ **Collision Detection**: Minimum 2 glitches for comparisons
- ✅ **Complexity**: Multi-node LangGraph workflow with validation

---

## 📝 License

MIT License - feel free to use this project for learning and hackathons!

---

## 👥 Team

**Member 1: The Architect**  
Focus: Backend, AI Logic, Deployment, & Data Structure

---

## 🙏 Acknowledgments

- Built with [LangGraph](https://github.com/langchain-ai/langgraph)
- Powered by [Groq](https://groq.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Deployed on [Vercel](https://vercel.com)
