// Customer Service Automation Demo Scenario Data
export interface DemoScenario {
  id: string
  title: string
  description: string
  beforeMetrics: BusinessMetrics
  afterMetrics: BusinessMetrics
  timeline: TimelineStep[]
  testimonial: CustomerTestimonial
}

export interface BusinessMetrics {
  responseTime: string
  resolutionRate: number
  customerSatisfaction: number
  monthlyCost: number
  agentCount: number
  ticketsPerDay: number
}

export interface TimelineStep {
  step: number
  title: string
  description: string
  duration: string
  status: 'completed' | 'current' | 'upcoming'
}

export interface CustomerTestimonial {
  name: string
  role: string
  company: string
  quote: string
  metrics: string
  avatar: string
}

export const customerServiceScenario: DemoScenario = {
  id: 'ecommerce-support',
  title: 'E-commerce Customer Support Transformation',
  description: 'TechMart reduced support costs by 73% while improving customer satisfaction',
  beforeMetrics: {
    responseTime: '4.2 hours',
    resolutionRate: 67,
    customerSatisfaction: 3.2,
    monthlyCost: 68000,
    agentCount: 12,
    ticketsPerDay: 450
  },
  afterMetrics: {
    responseTime: '28 seconds',
    resolutionRate: 94,
    customerSatisfaction: 4.7,
    monthlyCost: 18500,
    agentCount: 3,
    ticketsPerDay: 450
  },
  timeline: [
    {
      step: 1,
      title: 'API Integration',
      description: 'Connected Shopify, Zendesk, and payment systems',
      duration: '15 minutes',
      status: 'completed'
    },
    {
      step: 2,
      title: 'Agent Training',
      description: 'AI learned from 10,000 historical support tickets',
      duration: '2 hours',
      status: 'completed'
    },
    {
      step: 3,
      title: 'Testing & Refinement',
      description: 'Tested with 500 sample queries, 96% accuracy',
      duration: '1 day',
      status: 'completed'
    },
    {
      step: 4,
      title: 'Production Deployment',
      description: 'Live deployment with gradual traffic increase',
      duration: '30 minutes',
      status: 'completed'
    }
  ],
  testimonial: {
    name: 'Sarah Chen',
    role: 'VP of Customer Experience',
    company: 'TechMart',
    quote: 'LivelyAPI transformed our customer support overnight. We went from 4-hour response times to instant resolutions, and our customers love it.',
    metrics: '73% cost reduction, 94% resolution rate',
    avatar: 'SC'
  }
}

export const demoInteractions = [
  {
    id: 'order-status',
    userQuery: 'Where is my order #TM-12345?',
    agentResponse: 'I found your order #TM-12345! It was shipped yesterday via FedEx and is currently in transit. Your tracking number is 1234567890. Expected delivery is tomorrow by 3 PM. You\'ll receive an email notification when it\'s delivered.',
    apiCalls: ['GET /orders/TM-12345', 'GET /shipping/track/1234567890'],
    responseTime: '0.8s',
    satisfaction: 5
  },
  {
    id: 'return-request',
    userQuery: 'I want to return the blue sweater I bought last week',
    agentResponse: 'I can help you return the blue cotton sweater from order #TM-12340. I\'ve initiated a return request and emailed you a prepaid shipping label. You have 30 days from delivery to return items. Once we receive it, your refund of $49.99 will be processed within 3-5 business days.',
    apiCalls: ['GET /orders/recent', 'POST /returns/create', 'POST /shipping/label'],
    responseTime: '1.2s',
    satisfaction: 5
  },
  {
    id: 'product-recommendation',
    userQuery: 'Do you have any wireless headphones under $100?',
    agentResponse: 'Yes! Based on your previous purchases, I recommend the SoundWave Pro Wireless Headphones at $89.99. They have excellent reviews (4.8/5 stars), 30-hour battery life, and active noise cancellation. They\'re currently in stock with free 2-day shipping. Would you like me to add them to your cart?',
    apiCalls: ['GET /products/search', 'GET /recommendations/user', 'GET /inventory/check'],
    responseTime: '0.9s',
    satisfaction: 5
  },
  {
    id: 'billing-inquiry',
    userQuery: 'Why was I charged twice for my last order?',
    agentResponse: 'I see the confusion! You have two charges: $79.99 for your order #TM-12345 and $12.99 for expedited shipping you added after placing the order. Both charges are legitimate. I can provide detailed receipts for both transactions if needed. Your total was $92.98 as expected.',
    apiCalls: ['GET /billing/history', 'GET /orders/TM-12345/charges'],
    responseTime: '0.7s',
    satisfaction: 4
  },
  {
    id: 'account-help',
    userQuery: 'I forgot my password and can\'t log in',
    agentResponse: 'I can help you reset your password! I\'ve sent a secure password reset link to the email address associated with your account (s***@gmail.com). Please check your inbox and spam folder. The link will expire in 1 hour for security. If you don\'t receive it, I can try sending it to an alternate email.',
    apiCalls: ['POST /auth/password-reset', 'GET /user/profile'],
    responseTime: '0.6s',
    satisfaction: 5
  }
]

export const realTimeMetrics = {
  currentUsers: 247,
  activeAgents: 8,
  todayInteractions: 1834,
  avgResponseTime: 0.9,
  satisfactionScore: 4.6,
  costSavingsToday: 2847,
  ticketsResolved: 1654,
  escalationRate: 6.2
}

export const competitorComparison = {
  livelyapi: {
    setupTime: '15 minutes',
    responseTime: '0.9s',
    accuracy: '94%',
    monthlyCost: '$299',
    integrations: '50+',
    customization: 'Full'
  },
  zendesk: {
    setupTime: '2-4 weeks',
    responseTime: '2-4 hours',
    accuracy: '67%',
    monthlyCost: '$2,400',
    integrations: '20',
    customization: 'Limited'
  },
  intercom: {
    setupTime: '1-2 weeks',
    responseTime: '1-2 hours',
    accuracy: '72%',
    monthlyCost: '$1,800',
    integrations: '15',
    customization: 'Moderate'
  }
}

export const demoScript = {
  introduction: {
    duration: '30 seconds',
    talking_points: [
      'Welcome to LivelyAPI - the platform that transforms any API into intelligent customer service agents',
      'Today I\'ll show you how TechMart reduced support costs by 73% in just one day',
      'You\'ll see the complete transformation from 4-hour response times to instant resolutions'
    ]
  },
  problem_statement: {
    duration: '45 seconds',
    talking_points: [
      'TechMart was spending $68,000 monthly on 12 support agents',
      'Average response time was 4.2 hours, customer satisfaction only 3.2/5',
      'Only 67% of tickets were resolved on first contact',
      'Sound familiar? This is the reality for most e-commerce businesses'
    ]
  },
  solution_demo: {
    duration: '90 seconds',
    talking_points: [
      'Watch how we connected their Shopify store in 15 minutes',
      'Our AI analyzed 10,000 historical tickets to learn their patterns',
      'Now let\'s test the live agent - judges, feel free to try these queries',
      'Notice the instant responses with real API calls to their systems'
    ]
  },
  results_showcase: {
    duration: '45 seconds',
    talking_points: [
      'Response time: 4.2 hours → 28 seconds (99.8% improvement)',
      'Monthly costs: $68,000 → $18,500 (73% reduction)',
      'Customer satisfaction: 3.2 → 4.7 (47% improvement)',
      'ROI: 367% in the first month alone'
    ]
  },
  technical_differentiation: {
    duration: '30 seconds',
    talking_points: [
      'Unlike chatbots, our agents make real API calls',
      'No coding required - just describe what you want in plain English',
      'Enterprise-grade security with SOC 2 compliance',
      'Deploy in minutes, not months'
    ]
  }
}