# DeutschForge – Personal Cognitive German Mastery System

A production-ready personal learning application for mastering German from CEFR A1 to B2, with Goethe-Zertifikat exam preparation.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- (Optional) Groq API key for AI features

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and optional GROQ_API_KEY

# 3. Initialize database
npx prisma db push

# 4. Seed with A1 content
npm run db:seed

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS with glassmorphism
- **Animations**: Framer Motion
- **AI**: Groq API (only for writing grading, speaking, and grammar explanations)

## Modules

### Cognitive Practice Engine
FSRS-4.5 spaced repetition with interleaved vocabulary, grammar, and reading practice.

### Goethe Exam Simulator
Full mock exams with Lesen, Hören, Schreiben (AI-graded), and Sprechen (AI conversation).

## Cost Strategy
Static content is pre-seeded in the database. The Groq API is only called for high-value dynamic tasks.
