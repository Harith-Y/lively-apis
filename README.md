# LivelyAPI - AI Agent Platform

Transform any API into conversational AI agents with our revolutionary no-code platform.

## 🚀 Features

- **Natural Language Builder**: Describe your workflow in plain English
- **Universal API Integration**: Connect to REST APIs, GraphQL, webhooks, and databases
- **Real-time Testing**: Interactive playground for instant agent testing
- **Enterprise Security**: Bank-grade security with SOC 2 compliance
- **Advanced Analytics**: Monitor performance and optimize agents
- **One-Click Deploy**: Deploy to production instantly

## 🛠 Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Node.js with Express (handles all API/database/auth calls)
- **Database and Authentication**: Supabase (used only in backend)
- **UI**: Tailwind CSS + shadcn/ui components
- **AI**: Meta LLama-4
- **Deployment**: Vercel

## 🏗 Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # Agent management dashboard
│   ├── builder/           # Agent builder interface
│   ├── playground/        # Testing playground
│   └── auth/              # Authentication pages
├── components/
│   ├── ui/                # shadcn/ui components
│   └── layout/            # Layout components
└── lib/
    └── utils.ts           # Utility functions
backend/
  └── index.js            # Express backend (handles all Supabase/database/auth logic)
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd livelyapi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - For the frontend: `.env.local` (set `NEXT_PUBLIC_BACKEND_URL`)
   - For the backend: `backend/.env` (set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations (coming soon)
   - Update your environment variables

5. **Start the backend server**
   ```bash
   npm run backend:dev
   ```

6. **Start the frontend development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 Database Schema

The application uses Supabase (via the backend) with the following main tables:

- `agents`: Store agent configurations and metadata
- `agent_analytics`: Track usage metrics and performance
- `users`: User authentication and profiles (handled by Supabase Auth in backend)

## 🎯 Key Pages

- **Landing Page** (`/`): Hero section with features and CTA
- **Dashboard** (`/dashboard`): Manage and monitor your agents
- **Builder** (`/builder`): Create and configure new agents
- **Playground** (`/playground`): Test agents in real-time
- **Authentication** (`/auth/*`): Sign in/up flows (handled via backend API)

## 🎨 Design System

- **Colors**: Purple/blue gradient theme
- **Typography**: Inter font family
- **Components**: shadcn/ui with custom styling
- **Responsive**: Mobile-first approach
- **Animations**: Framer Motion for smooth interactions

## 🔧 Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run backend:dev`: Start backend server

### Code Style

- TypeScript for type safety
- ESLint + Prettier for code formatting
- Tailwind CSS for styling
- Component-based architecture

## 🚀 Deployment

The application is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard (for both frontend and backend)
3. Deploy automatically on push to main branch

## 🏆 Hackathon Features

Built for **Suprathon 2025** with focus on:

- ⚡ Rapid development (24-hour constraint)
- 🎯 Clear user flow for judges
- ✨ Visual impact and professional polish
- 🔧 Working prototype over perfect code
- 📈 Compelling business metrics integration

## 📝 License

This project is built for Suprathon 2025. All rights reserved.

## 🤝 Contributing

This is a hackathon project. For questions or suggestions, please reach out to the team.

---

**Built with ❤️ for Suprathon 2025**