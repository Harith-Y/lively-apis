# LivelyAPI - AI Agent Platform

Transform any API into conversational AI agents with our revolutionary no-code platform. Built for **Suprathon 2025** with focus on rapid development and compelling business impact.

## 🚀 Features

- **Natural Language Builder**: Describe your workflow in plain English and watch AI generate your agent automatically
- **Universal API Integration**: Connect to REST APIs, GraphQL, webhooks, and databases with zero coding required
- **Real-time Testing**: Interactive playground for instant agent testing before deployment
- **Enterprise Security**: Bank-grade security with SOC 2 compliance and end-to-end encryption
- **Advanced Analytics**: Monitor performance, track ROI, and optimize agents with detailed business metrics
- **One-Click Deploy**: Deploy your agents to production with a single click and scale automatically
- **Interactive Demo**: Live customer service transformation showcase with real-time metrics
- **Template Library**: Pre-built templates for common use cases

## 🛠 Tech Stack

- **Frontend**: Next.js 15.4.2 with TypeScript and React 19.1.0
- **Backend**: Node.js with Express (handles all API/database/auth calls)
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **Authentication**: Supabase Auth with JWT tokens
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion for smooth interactions
- **Charts**: Recharts for data visualization
- **AI Integration**: OpenRouter API for LLM access
- **Deployment**: Vercel (Frontend) + Render (Backend)

## 🏗 Project Structure

```
lively-apis/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── page.tsx           # Landing page with hero, features, pricing
│   │   ├── dashboard/         # Agent management dashboard
│   │   ├── builder/           # Agent builder interface
│   │   ├── playground/        # Testing playground
│   │   ├── demo/              # Interactive demo showcase
│   │   ├── templates/         # Template library
│   │   ├── analytics/         # Business metrics dashboard
│   │   ├── deploy/            # One-click deployment
│   │   └── auth/              # Authentication pages
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   └── layout/            # Layout components
│   └── lib/
│       ├── ai-integration.ts  # AI/LLM integration
│       ├── agent-planner.ts   # Agent planning logic
│       ├── api-analyzer.ts    # API analysis utilities
│       ├── demo-data.ts       # Demo data and metrics
│       ├── demo-scenario.ts   # Customer service demo
│       ├── theme.ts           # Dark mode theme manager
│       └── utils.ts           # Utility functions
├── backend/
│   ├── index.js              # Express backend server
│   ├── ai-integration.js     # Backend AI integration
│   └── package.json          # Backend dependencies
└── public/                   # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenRouter API key (for AI features)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd lively-apis
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Setup

Create the following environment files:

**Frontend (`.env.local`):**

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:10000
OPENROUTER_API_KEY=your_openrouter_api_key
```

**Backend (`backend/.env`):**

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=10000
```

### 5. Start Development Servers

```bash
# Terminal 1: Start backend
npm run backend:dev

# Terminal 2: Start frontend
npm run dev
```

### 6. Open Your Browser

Navigate to `http://localhost:3000`

## 📊 Key Features Deep Dive

### 🎯 Interactive Demo (`/demo`)

- Live customer service transformation showcase
- Real-time metrics updates
- Before/after comparison with TechMart case study
- Interactive walkthrough with automated demo flow
- ROI calculation and business impact visualization

### 🏗 Agent Builder (`/builder`)

- Natural language workflow description
- API endpoint analysis and integration
- Real-time agent planning and configuration
- One-click deployment to production
- Template-based agent creation

### 🎮 Playground (`/playground`)

- Real-time agent testing with sample queries
- Multiple demo agents (e-commerce, payments, communication)
- Response time and accuracy metrics
- API call visualization

### 📈 Analytics (`/analytics`)

- Business impact dashboard with ROI calculations
- Cost savings and time automation metrics
- Performance analytics and response time distribution
- Agent-specific metrics and comparisons

### 🚀 Deploy (`/deploy`)

- One-click agent deployment
- Multiple integration options (webhook, widget, REST API)
- Deployment status monitoring
- Production URL generation

### 📚 Templates (`/templates`)

- Pre-built agent templates
- Category-based filtering
- "Use Template" functionality
- Sample queries and capabilities

## 🎨 Design System

- **Colors**: Purple/blue gradient theme with modern aesthetics
- **Typography**: Inter font family for readability
- **Components**: shadcn/ui with custom styling
- **Responsive**: Mobile-first approach with Tailwind CSS
- **Animations**: Framer Motion for smooth interactions
- **Dark Mode**: Full dark mode support with theme persistence

## 🔧 Development

### Available Scripts

```bash
npm run dev              # Start frontend development server
npm run backend:dev      # Start backend server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

### Code Style

- TypeScript for type safety
- ESLint + Next.js config for code formatting
- Tailwind CSS for styling
- Component-based architecture
- Server and client components separation

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_BACKEND_URL`
   - `OPENROUTER_API_KEY`
3. Deploy automatically on push to main branch

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `PORT`
4. Set build command: `npm install`
5. Set start command: `npm start`

## 📊 Database Schema

### Core Tables

- **`templates`**: Pre-built agent templates
- **`agents`**: User-created agent configurations
- **`feedback`**: Contact form submissions
- **`users`**: Authentication (handled by Supabase Auth)

### Key Relationships

- Agents belong to users (user_id foreign key)
- Templates are shared across all users
- Feedback is anonymous but tracked

## 🎯 API Endpoints

### Authentication

- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/signout` - User logout
- `GET /auth/me` - Get current user
- `POST /auth/forgot-password` - Password reset
- `POST /auth/reset-password` - Password update

### Agents

- `POST /agents` - Create new agent
- `GET /api/templates` - Get available templates

### Playground

- `POST /playground/agent-response` - Get AI agent response

### Feedback

- `POST /feedback` - Submit contact form

## 🏆 Hackathon Features

Built for **Suprathon 2025** with focus on:

- ⚡ **Rapid Development**: Complete platform built in 24 hours
- 🎯 **Clear User Flow**: Intuitive navigation for judges
- ✨ **Visual Impact**: Professional polish with animations
- 🔧 **Working Prototype**: Fully functional over perfect code
- 📈 **Business Metrics**: Compelling ROI and cost savings
- 🎮 **Interactive Demo**: Live showcase of capabilities
- 🚀 **One-Click Deploy**: Production-ready deployment

## 🎨 Key Pages Overview

- **Landing Page** (`/`): Hero section, features, pricing, testimonials
- **Dashboard** (`/dashboard`): Agent management and monitoring
- **Builder** (`/builder`): Create and configure new agents
- **Playground** (`/playground`): Test agents in real-time
- **Demo** (`/demo`): Interactive customer service transformation
- **Templates** (`/templates`): Pre-built agent templates
- **Analytics** (`/analytics`): Business metrics and ROI
- **Deploy** (`/deploy`): One-click deployment interface
- **Authentication** (`/auth/*`): Sign in/up flows

## 🔒 Security Features

- JWT-based authentication
- CORS protection
- Environment variable security
- Supabase RLS (Row Level Security)
- Input validation and sanitization

## 📝 License

This project is built for Suprathon 2025. All rights reserved.

## 🤝 Contributing

This is a hackathon project. For questions or suggestions, please reach out to the team.

---

**Built with ❤️ for Suprathon 2025**
