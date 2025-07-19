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
- **Backend**: Node.js with Express
- **Database**: Supabase (real-time capabilities)
- **Authentication**: NextAuth.js
- **UI**: Tailwind CSS + shadcn/ui components
- **AI**: OpenAI GPT-4 / Anthropic Claude
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
    ├── supabase.ts        # Supabase client
    └── utils.ts           # Utility functions
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
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your Supabase credentials and other API keys.

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations (coming soon)
   - Update your environment variables

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 Database Schema

The application uses Supabase with the following main tables:

- `agents`: Store agent configurations and metadata
- `agent_analytics`: Track usage metrics and performance
- `users`: User authentication and profiles (handled by Supabase Auth)

## 🎯 Key Pages

- **Landing Page** (`/`): Hero section with features and CTA
- **Dashboard** (`/dashboard`): Manage and monitor your agents
- **Builder** (`/builder`): Create and configure new agents
- **Playground** (`/playground`): Test agents in real-time
- **Authentication** (`/auth/*`): Sign in/up flows

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

### Code Style

- TypeScript for type safety
- ESLint + Prettier for code formatting
- Tailwind CSS for styling
- Component-based architecture

## 🚀 Deployment

The application is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
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