# AI Intelligence Layer - MVP Documentation

## 1. MVP Scope

### Target Users
**Primary**: College Students & Job Seekers preparing for tech careers

**User Personas**:
- **College Students**: Computer Science/IT students learning new technologies, preparing for placements
- **Job Seekers**: Career switchers and bootcamp graduates needing structured learning paths
- **Skill Upgraders**: Working professionals upskilling for promotions or new roles

### 3 Core Features

#### Feature 1: AI-Powered Adaptive Assessment
- **What**: Dynamic skill testing that adapts difficulty based on responses
- **Why**: Accurately identifies knowledge gaps without overwhelming users
- **How**: 
  - Multi-level questions (beginner → advanced)
  - Real-time difficulty adjustment
  - Instant feedback with explanations
  - Skill proficiency scoring (0-100%)

#### Feature 2: Personalized Learning Roadmap
- **What**: Custom career path with milestones, resources, and timelines
- **Why**: Removes confusion about "what to learn next"
- **How**:
  - Goal-based roadmap generation (e.g., "Frontend Developer in 6 months")
  - Weekly learning milestones
  - Resource recommendations (courses, docs, projects)
  - Progress tracking with visual timelines

#### Feature 3: Smart Analytics Dashboard
- **What**: Real-time insights into learning progress, strengths, and gaps
- **Why**: Data-driven learning decisions improve outcomes
- **How**:
  - Skill proficiency charts
  - Learning streak & time tracking
  - Gap analysis with recommendations
  - Peer comparison (anonymous benchmarking)

---

## 2. User Flow

```
┌─────────────┐
│   Landing   │ → View features, pricing, testimonials
│    Page     │ → CTA: "Get Started Free"
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Sign Up   │ → Email/password or OAuth (Google)
│  /signup    │ → Email verification sent
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Onboarding  │ → Select target role (Frontend Dev, Data Scientist, etc.)
│ /onboarding │ → Select experience level (Beginner/Intermediate/Advanced)
│             │ → Set learning goal & timeline
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Dashboard  │ → Overview of progress, next tasks, AI insights
│ /dashboard  │ → Quick access to: Assessment, Roadmap, Analytics
└──────┬──────┘
       │
       ├───────────────────┬───────────────────┐
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ Assessment  │   │   Roadmap   │   │  Analytics  │
│ /assessment │   │  /roadmap   │   │ /analytics  │
│             │   │             │   │             │
│ Take test → │   │ View path → │   │ View stats →│
│ Get score → │   │ Track tasks │   │ Insights    │
│ AI feedback │   │ Resources   │   │ Gap analysis│
└─────────────┘   └─────────────┘   └─────────────┘
       │                   │                   │
       └───────────────────┴───────────────────┘
                           │
                           ▼
                  ┌─────────────┐
                  │  Feedback   │ → Rate experience (1-5 stars)
                  │   (Modal)   │ → Suggest improvements
                  └─────────────┘
```

---

## 3. Database Schema (Supabase)

### Tables

#### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  email_verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT
);
```

#### `user_profiles`
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_role VARCHAR(100) NOT NULL, -- e.g., "Frontend Developer"
  experience_level VARCHAR(50) NOT NULL, -- "Beginner", "Intermediate", "Advanced"
  learning_goal TEXT,
  timeline_weeks INTEGER, -- e.g., 12 weeks
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `assessments`
```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_area VARCHAR(100) NOT NULL, -- e.g., "JavaScript", "React", "Algorithms"
  score INTEGER CHECK (score >= 0 AND score <= 100),
  difficulty_level VARCHAR(50), -- "Easy", "Medium", "Hard"
  questions_answered INTEGER,
  correct_answers INTEGER,
  time_taken_seconds INTEGER,
  ai_feedback TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `roadmaps`
```sql
CREATE TABLE roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_role VARCHAR(100),
  total_milestones INTEGER,
  completed_milestones INTEGER DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0,
  estimated_weeks INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `milestones`
```sql
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID REFERENCES roadmaps(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- "pending", "in_progress", "completed"
  resources JSONB, -- [{title, url, type}]
  estimated_days INTEGER,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `progress_logs`
```sql
CREATE TABLE progress_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(100) NOT NULL, -- "assessment_completed", "milestone_completed", "study_session"
  activity_data JSONB, -- flexible metadata
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `skill_metrics`
```sql
CREATE TABLE skill_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  proficiency_score INTEGER CHECK (proficiency_score >= 0 AND proficiency_score <= 100),
  assessments_taken INTEGER DEFAULT 0,
  last_assessed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, skill_name)
);
```

#### `feedback`
```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feature VARCHAR(100), -- "assessment", "roadmap", "analytics", "general"
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. AI Integration Points

### Point 1: Adaptive Assessment Engine
- **Trigger**: User starts assessment
- **Process**:
  1. Start with medium-difficulty questions
  2. If user answers correctly → increase difficulty
  3. If user answers incorrectly → decrease difficulty
  4. Track accuracy rate and adjust in real-time
- **AI Model**: Question difficulty classifier + recommendation engine
- **Data**: Question bank with difficulty tags, user response patterns

### Point 2: Personalized Roadmap Generator
- **Trigger**: User completes onboarding or requests new roadmap
- **Process**:
  1. Analyze: target role + experience level + assessment scores
  2. Generate: Custom learning path with milestones
  3. Recommend: Resources (courses, articles, projects)
  4. Adapt: Update based on progress and performance
- **AI Model**: Path recommendation system (rule-based + ML)
- **Data**: Role requirements, skill dependencies, user progress

### Point 3: Smart Analytics & Insights
- **Trigger**: User views analytics dashboard
- **Process**:
  1. Aggregate: All assessment scores, progress logs, time spent
  2. Analyze: Identify skill gaps, learning patterns, trends
  3. Generate: Actionable insights ("Focus on async/await", "You're 20% ahead of peers")
  4. Predict: Estimated completion dates, success probability
- **AI Model**: Anomaly detection, trend analysis, predictive modeling
- **Data**: Historical performance, peer benchmarks, industry standards

### Point 4: Daily AI Guidance
- **Trigger**: User visits dashboard daily
- **Process**:
  1. Context: Check recent activity, upcoming milestones, skill gaps
  2. Generate: 1-3 personalized tips/recommendations
  3. Vary: Motivational messages, learning strategies, resource suggestions
- **AI Model**: Content recommendation + NLP for message generation
- **Data**: User activity history, engagement patterns

### Point 5: AI Chatbot Assistant
- **Trigger**: User opens chatbot widget
- **Process**:
  1. Answer: Questions about platform, learning paths, concepts
  2. Guide: Help navigate features, suggest next actions
  3. Tutor: Explain programming concepts, debug code snippets
- **AI Model**: Conversational AI (RAG + LLM)
- **Data**: Platform documentation, user context, knowledge base

---

## 5. Progress & Analytics Logic

### Progress Tracking
```javascript
// Calculate overall progress
overallProgress = (completedMilestones / totalMilestones) * 100

// Calculate skill proficiency
skillProficiency = (
  (assessmentScores.average * 0.6) + 
  (practiceCompleted * 0.3) + 
  (projectsCompleted * 0.1)
) / 100

// Learning streak
consecutiveDays = daysWithActivity.filter(date => isConsecutive(date)).length

// Study time
totalStudyTime = sum(sessionDurations) // in minutes
weeklyAverage = totalStudyTime / weeksActive
```

### Analytics Insights
```javascript
// Gap analysis
skillGaps = targetSkills.filter(skill => 
  userSkills[skill].proficiency < 70
)

// Peer comparison
userRank = sortedUsers.indexOf(currentUser) + 1
percentile = (userRank / totalUsers) * 100

// Recommendation priority
recommendations = skillGaps
  .sort((a, b) => b.importance - a.importance)
  .slice(0, 3)

// Progress velocity
velocity = recentProgress / previousProgress
trend = velocity > 1 ? "accelerating" : "decelerating"
```

---

## 6. Edge Cases & Error Handling

### Authentication Edge Cases
- **Email already exists**: Show "Already have an account? Login"
- **Invalid email format**: Client-side validation with instant feedback
- **Weak password**: Enforce 8+ chars, 1 uppercase, 1 number
- **Email verification expired**: Allow resend link with rate limiting
- **OAuth failure**: Fallback to manual signup, clear error message

### Assessment Edge Cases
- **Network failure mid-test**: Auto-save progress, allow resume
- **Browser refresh**: Warn user before leaving, save state
- **Time limit exceeded**: Auto-submit with completed answers
- **No questions available**: Show "Coming soon" message, suggest alternatives
- **Server error**: Retry mechanism, user-friendly error message

### Roadmap Edge Cases
- **No milestones generated**: Show default template, allow manual customization
- **All milestones completed**: Congratulate user, suggest advanced paths
- **Resource link broken**: Mark as unavailable, suggest alternatives
- **User changes goal mid-way**: Offer to regenerate or adapt existing roadmap

### Progress Tracking Edge Cases
- **Negative progress (data inconsistency)**: Reset to 0, log error for review
- **Missing assessment data**: Use placeholder scores, prompt user to take tests
- **Timezone issues**: Store all timestamps in UTC, display in user's local time
- **Concurrent updates**: Use optimistic locking, last-write-wins with conflict resolution

### General Error Handling
```javascript
try {
  // Critical operation
} catch (error) {
  // Log error to monitoring service (Sentry)
  logError(error, { userId, context })
  
  // Show user-friendly message
  showNotification({
    type: "error",
    title: "Something went wrong",
    message: "We're working on it. Please try again in a moment.",
    action: { label: "Retry", onClick: retryOperation }
  })
  
  // Fallback behavior
  loadCachedData() || showDefaultState()
}
```

---

## 7. Security Implementation

### Authentication (Supabase Auth)
```javascript
// Email/Password signup
const { data, error } = await supabase.auth.signUp({
  email: email,
  password: password,
  options: {
    emailRedirectTo: `${siteUrl}/verify-email`,
    data: { full_name: fullName }
  }
})

// OAuth (Google)
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${siteUrl}/dashboard`
  }
})

// Session management
const { data: { session } } = await supabase.auth.getSession()
// Auto-refresh tokens handled by Supabase client
```

### Input Validation
```javascript
// Server-side validation (API routes)
import { z } from 'zod'

const AssessmentSchema = z.object({
  skill_area: z.string().min(1).max(100),
  score: z.number().int().min(0).max(100),
  questions_answered: z.number().int().positive()
})

// Validate before database insertion
const validatedData = AssessmentSchema.parse(requestBody)
```

### Rate Limiting
```javascript
// API route rate limiting (using Upstash Redis)
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
  analytics: true
})

// Apply to assessment submission
const { success } = await ratelimit.limit(userId)
if (!success) {
  return new Response("Too many requests", { status: 429 })
}
```

### Data Protection
```sql
-- Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read their own profile
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
USING (auth.uid() = user_id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Similar policies for assessments, roadmaps, progress_logs
```

### XSS Prevention
```javascript
// Sanitize user input before rendering
import DOMPurify from 'isomorphic-dompurify'

const sanitizedComment = DOMPurify.sanitize(userComment)
```

### HTTPS & Secure Cookies
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ]
      }
    ]
  }
}
```

---

## 8. 2-Minute Demo Flow

### Demo Scenario: "From Zero to Learning in 2 Minutes"

**Time 0:00-0:20** (Landing → Signup)
1. Show landing page with headline: "AI-Powered Learning Path for Your Dream Tech Job"
2. Highlight 3 features with icons + 1-line descriptions
3. Click "Get Started Free" → Signup page
4. Quick signup: "demo@example.com" → "Sign Up with Email"

**Time 0:20-0:40** (Onboarding)
5. "What's your goal?" → Select "Frontend Developer"
6. "Experience level?" → Select "Intermediate"
7. "Timeline?" → Select "3 months"
8. Click "Generate My Learning Path" → Loading animation (1-2 seconds)

**Time 0:40-1:00** (Dashboard)
9. Dashboard loads with:
   - Welcome message: "Welcome back, Demo!"
   - AI Insight card: "Start with JavaScript fundamentals assessment"
   - Quick stats: Streak (0 days), Skills (0), Study Time (0h), AI Score (--%)
   - 3 feature cards: Assessment, Roadmap, Analytics

**Time 1:00-1:20** (Assessment - Quick Demo)
10. Click "AI-Powered Assessment" → Assessment page
11. Show question 1: "What is the output of `console.log(typeof [])`?"
    - Options: A) array B) object C) undefined D) null
12. Select "B) object" → Instant feedback: ✓ Correct!
13. Question 2 (harder): "Explain event delegation in JavaScript"
14. Skip detailed answer → Show score preview: "85% - Great job!"

**Time 1:20-1:40** (Roadmap)
15. Back to dashboard → Click "Learning Roadmap"
16. Show personalized roadmap with 6 milestones:
    - Week 1-2: JavaScript ES6+ Mastery ✓ (In Progress)
    - Week 3-4: React Fundamentals
    - Week 5-6: State Management (Redux/Context)
    - Week 7-8: API Integration & Async
    - Week 9-10: Styling & UI Libraries
    - Week 11-12: Build Portfolio Project
17. Expand "JavaScript ES6+ Mastery" → Show tasks + resources

**Time 1:40-2:00** (Analytics & Wrap-Up)
18. Click "Analytics" → Show dashboard with:
    - Skill proficiency chart (demo data pre-populated)
    - Gap analysis: "Focus on: Async/Await, Promises, Closures"
    - Peer comparison: "You're in the top 25% of learners"
19. Show AI recommendation: "Next step: Complete React Hooks assessment"
20. End with CTA: "Your personalized learning journey starts now!" → "Continue Learning" button

### Key Demo Highlights
- ✅ Fast onboarding (< 30 seconds)
- ✅ AI-powered personalization (role, level, timeline)
- ✅ Interactive assessment with instant feedback
- ✅ Visual roadmap with clear milestones
- ✅ Data-driven insights and recommendations

---

## 9. Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: React hooks (useState, useEffect, Context API)
- **Animations**: Framer Motion (optional)

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Next.js API routes (serverless)
- **File Storage**: Supabase Storage (for avatars, resources)

### AI/ML
- **LLM Integration**: OpenAI API (GPT-4) for chatbot & content generation
- **Recommendations**: Custom algorithm (rule-based + collaborative filtering)
- **Analytics**: PostgreSQL queries + aggregations

### DevOps
- **Hosting**: Vercel (Next.js optimized)
- **CI/CD**: Vercel auto-deploy (Git integration)
- **Monitoring**: Vercel Analytics + Sentry for error tracking
- **Rate Limiting**: Upstash Redis (optional)

### Additional Tools
- **Email**: Resend or Supabase email templates
- **Icons**: Lucide React
- **Charts**: Recharts or Chart.js
- **Forms**: React Hook Form + Zod validation

---

## 10. Problem → Solution Mapping

### Problem 1: Information Overload
**User Pain**: "Too many resources online, don't know where to start"
**Solution**: AI generates personalized roadmap based on goal, level, and timeline

### Problem 2: Lack of Progress Tracking
**User Pain**: "Can't tell if I'm improving or wasting time"
**Solution**: Real-time analytics dashboard with skill scores, streaks, and benchmarks

### Problem 3: Generic Learning Paths
**User Pain**: "One-size-fits-all courses don't match my background"
**Solution**: Adaptive assessments identify exact skill gaps and adjust content

### Problem 4: Motivation & Accountability
**User Pain**: "Start strong, then lose momentum and quit"
**Solution**: Daily AI guidance, streak tracking, milestone celebrations, peer comparison

### Problem 5: No Clear Career Direction
**User Pain**: "What skills do employers actually want?"
**Solution**: Role-based roadmaps aligned with job market demand + industry benchmarks

---

## Success Metrics (MVP Launch)

### User Engagement
- **Target**: 500 signups in first month
- **Metric**: 70% complete onboarding
- **Metric**: 40% return after 7 days (retention)

### Feature Adoption
- **Target**: 80% take at least 1 assessment
- **Target**: 60% view roadmap within first session
- **Target**: 30% check analytics dashboard weekly

### Learning Outcomes
- **Target**: Average skill improvement of 15% after 4 weeks
- **Target**: 50% of users complete at least 2 milestones
- **Target**: 4.0+ average rating from feedback surveys

### Business Metrics
- **Target**: < $500 infrastructure costs for MVP
- **Target**: < 500ms page load times (Lighthouse score 90+)
- **Target**: < 0.1% error rate across all API endpoints

---

## Next Steps (Post-MVP)

1. **Premium Features**: Unlock advanced analytics, 1-on-1 AI tutoring, project reviews
2. **Mobile App**: iOS + Android for on-the-go learning
3. **Community Features**: Forums, study groups, mentor matching
4. **Certifications**: Issue verifiable skill certificates
5. **Company Partnerships**: Job placement assistance, recruiter access
6. **Content Expansion**: More roles (DevOps, Cybersecurity, AI/ML)
7. **Gamification**: Badges, leaderboards, challenges, competitions

---

**Document Version**: 1.0  
**Last Updated**: December 16, 2025  
**Status**: MVP Ready for Implementation
