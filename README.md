# Quiz Management System 

A modern, full-stack quiz management application built with Next.js and Express.js. Create, manage, and take interactive quizzes with support for multiple question types including Multiple Choice, True/False, and Short Text questions.

> **Live Demo**: 

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Quick Start](#-quick-start)
- [Deployment Guide](#-deployment-guide)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-endpoints)
- [User Guide](#-user-guide)
- [Troubleshooting](#-troubleshooting-deployment)
- [Contributing](#-contributing)

---

##  Features

- **Admin Dashboard**: Create and manage quizzes with an intuitive interface
- **Multiple Question Types**: Support for MCQ, True/False, and Short Text questions
- **Real-time Progress Tracking**: Visual progress indicators while taking quizzes
- **Instant Results**: Get immediate feedback with score percentages
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Type-Safe**: Full TypeScript support on the frontend
- **Database Persistence**: PostgreSQL database with Neon serverless

##  Tech Stack

### Frontend
- **Framework**: Next.js 16.0.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Custom component library
- **State Management**: React Hooks

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon Serverless)
- **Database Client**: @neondatabase/serverless
- **Middleware**: CORS, Express JSON

## roject Structure

```
quiz-app/
├── backend/
│   ├── server.js                 # Express server setup
│   ├── db.js                     # Database connection & utilities
│   ├── migrate.js                # Database migration script
│   ├── controllers/
│   │   └── quizController.js     # Quiz CRUD operations
│   └── routes/
│       └── quizRoutes.js         # API routes
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Home page (quiz list)
│   │   │   ├── admin/
│   │   │   │   └── page.tsx      # Admin dashboard
│   │   │   └── quiz/[id]/
│   │   │       └── page.tsx      # Quiz taking page
│   │   ├── components/
│   │   │   ├── QuizCard.tsx      # Quiz list item
│   │   │   ├── QuizRunner.tsx    # Quiz interface
│   │   │   ├── QuestionEditor.tsx # Question editor
│   │   │   └── ui/               # Reusable UI components
│   │   └── lib/
│   │       ├── api.ts            # API client functions
│   │       └── types.ts          # TypeScript type definitions
│   └── public/                   # Static assets
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (Neon account recommended)

### 1. Clone the Repository
```bash
git clone https://github.com/devablesson/quiz-app.git
cd quiz-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
DATABASE_URL=your_neon_database_url
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

Run database migrations:
```bash
npm run migrate
```

Start the backend server:
```bash
npm run dev
```

The backend will be available at `http://localhost:4000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_ADMIN_TOKEN=your_secret_token
```

Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Database Schema

### `quizzes` Table
```sql
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL
);
```

### `questions` Table
```sql
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  quiz_id INT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option TEXT NOT NULL
);
```

## API Endpoints

### Quiz Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quizzes` | Get all quizzes |
| GET | `/api/quizzes/:id` | Get quiz by ID with questions |
| POST | `/api/quizzes` | Create new quiz (requires admin token) |
| DELETE | `/api/quizzes/:id` | Delete quiz (requires admin token) |
| POST | `/api/quizzes/:id/submit` | Submit quiz answers |

### Request/Response Examples

#### Create Quiz
```json
POST /api/quizzes
Headers: { "x-admin-token": "your_secret_token" }

{
  "title": "JavaScript Basics",
  "questions": [
    {
      "text": "What is JavaScript?",
      "options": {
        "a": "A programming language",
        "b": "A coffee brand",
        "c": "A Java framework",
        "d": "A markup language"
      },
      "correct_option": "a"
    }
  ]
}
```

#### Submit Quiz
```json
POST /api/quizzes/1/submit

{
  "answers": [
    {
      "questionId": 1,
      "selectedOption": "a"
    }
  ]
}

Response:
{
  "quizId": 1,
  "totalQuestions": 1,
  "correct": 1,
  "scorePercentage": 100
}
```

## Features in Detail

### Question Types

1. **Multiple Choice Questions (MCQ)**
   - Support for up to 8 options (a-h)
   - Single correct answer selection
   
2. **True/False Questions**
   - Binary choice questions
   - Simplified interface
   
3. **Text Questions**
   - Free-form text input
   - Reference answer for evaluation

### Admin Features
- Create quizzes with custom titles
- Add multiple questions per quiz
- Edit question text and options
- Set correct answers
- Remove questions
- Instant validation

### User Features
- Browse available quizzes
- Take quizzes with progress tracking
- Submit answers for immediate scoring
- View results with percentage scores

## Deployment Guide

This application is designed to be deployed with the frontend on **Vercel** and backend on **Render**. Follow these step-by-step instructions for a production deployment.

### Prerequisites for Deployment
- GitHub account with your code pushed
- Vercel account (free tier available)
- Render account (free tier available)
- Neon database account (free tier available)

---

### For Quiz Administrators

#### Creating Your First Quiz

1. **Access Admin Panel**: Navigate to `/admin` from the home page
2. **Enter Quiz Title**: Give your quiz a descriptive name
3. **Add Questions**: Click "Add Question" to create questions
4. **Configure Each Question**:
   - Enter the question prompt
   - Select question type (MCQ, True/False, or Text)
   - Fill in options or placeholder text
   - Mark the correct answer
5. **Review**: Check all questions are complete
6. **Publish**: Click "Publish Quiz" to make it available

#### Question Type Guide

**Multiple Choice Questions (MCQ)**
- Best for: Testing knowledge with several possible answers
- Setup: Provide 2-8 options, mark one as correct
- Example: "What is the capital of France?"
  - a) London
  - b) Paris ✓
  - c) Berlin
  - d) Madrid

**True/False Questions**
- Best for: Quick fact verification
- Setup: Automatically provides True/False options
- Example: "JavaScript is a compiled language"
  - True
  - False ✓

**Text Questions**
- Best for: Open-ended responses, definitions, short answers
- Setup: Provide a reference answer for evaluation
- Example: "Define 'variable' in programming"
  - Reference: "A container for storing data values"

#### Admin Best Practices

 **Do's**
- Write clear, unambiguous questions
- Ensure correct answers are accurate
- Test your quiz before sharing
- Use varied question types for engagement
- Keep questions concise and focused

**Don'ts**
- Don't create questions without correct answers
- Avoid overly complex or trick questions
- Don't use offensive or inappropriate content
- Avoid duplicate questions in same quiz


---
## Testing

### Manual Testing Checklist

**Frontend Tests**:
- [ ] Home page loads and displays quizzes
- [ ] Quiz cards are clickable and navigate correctly
- [ ] Admin page loads without errors
- [ ] Can create quiz with all question types
- [ ] Form validation works (empty fields)
- [ ] Quiz taking interface works
- [ ] Progress bar updates correctly
- [ ] Submit button is disabled until all answered
- [ ] Results display correctly
- [ ] Mobile responsive design works

**Backend Tests**:
- [ ] Health check endpoint responds
- [ ] GET /api/quizzes returns quiz list
- [ ] GET /api/quizzes/:id returns quiz details
- [ ] POST /api/quizzes creates quiz (with token)
- [ ] POST /api/quizzes fails without token
- [ ] POST /api/quizzes/:id/submit scores correctly
- [ ] DELETE /api/quizzes/:id removes quiz
- [ ] Invalid requests return proper errors
- [ ] CORS headers are correct


---


##  Quick Start (TLDR)

```bash
# 1. Clone and install
git clone https://github.com/devablesson/quiz-app.git
cd quiz-app

# 2. Backend
cd backend
npm install
echo "DATABASE_URL=your_neon_url" > .env
npm run migrate
npm run dev

# 3. Frontend (new terminal)
cd ../frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local
echo "NEXT_PUBLIC_ADMIN_TOKEN=secret123" >> .env.local
npm run dev

# 4. Open http://localhost:3000
```

---

## Available Scripts & Commands

### Backend Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run migrate    # Run database migrations
npm run migrate:fix # Fix database schema issues
```

### Frontend Scripts
```bash
npm run dev        # Start Next.js development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

---

## Testing Guide

### Manual Testing Checklist

**Frontend Tests**:
- [ ] Home page loads and displays quizzes
- [ ] Quiz cards are clickable and navigate correctly
- [ ] Admin page loads without errors
- [ ] Can create quiz with all question types
- [ ] Form validation works (empty fields)
- [ ] Quiz taking interface works
- [ ] Progress bar updates correctly
- [ ] Submit button is disabled until all answered
- [ ] Results display correctly
- [ ] Mobile responsive design works

**Backend Tests**:
- [ ] Health check endpoint responds
- [ ] GET /api/quizzes returns quiz list
- [ ] GET /api/quizzes/:id returns quiz details
- [ ] POST /api/quizzes creates quiz (with token)
- [ ] POST /api/quizzes fails without token
- [ ] POST /api/quizzes/:id/submit scores correctly
- [ ] DELETE /api/quizzes/:id removes quiz
- [ ] Invalid requests return proper errors
- [ ] CORS headers are correct

---


## Author

**devablesson**
- GitHub: [@devablesson](https://github.com/devablesson)

##  Acknowledgments
- Neon for serverless PostgreSQL
- Vercel for Next.js hosting
- The open-source community

---

**Note**: This project was built as a demonstration of modern full-stack development practices with a focus on rapid prototyping and production-ready code.
