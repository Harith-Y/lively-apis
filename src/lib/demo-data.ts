// Demo data for showcasing LivelyAPI capabilities
export interface DemoAgent {
  id: string
  name: string
  description: string
  category: 'ecommerce' | 'payments' | 'communication'
  api: string
  status: 'active' | 'inactive' | 'testing'
  metrics: {
    interactions: number
    successRate: number
    avgResponseTime: number
    costSavings: number
    timeAutomated: number
  }
  capabilities: string[]
  sampleQueries: string[]
  responses: Record<string, string>
}

export const demoAgents: DemoAgent[] = [
  {
    id: 'ecommerce-assistant',
    name: 'E-commerce Assistant',
    description: 'Handles product inquiries, order tracking, and inventory management for online stores',
    category: 'ecommerce',
    api: 'Shopify',
    status: 'active',
    metrics: {
      interactions: 2847,
      successRate: 96.2,
      avgResponseTime: 1.4,
      costSavings: 15600,
      timeAutomated: 142
    },
    capabilities: [
      'Product search and recommendations',
      'Order status tracking',
      'Inventory level checks',
      'Customer account management',
      'Return and refund processing'
    ],
    sampleQueries: [
      'What\'s the status of order #12345?',
      'Do you have the blue sweater in size medium?',
      'I want to return my recent purchase',
      'Show me products similar to what I bought last time',
      'When will my order arrive?'
    ],
    responses: {
      'order_status': 'Your order #12345 is currently being prepared for shipment. It will be dispatched within 24 hours and should arrive by Friday, January 26th. You\'ll receive a tracking number via email once it ships.',
      'product_availability': 'Yes! The blue cotton sweater is available in size medium. We have 8 units in stock. Would you like me to add it to your cart?',
      'return_request': 'I can help you start a return. Please provide your order number and the reason for return. Our return policy allows 30 days from delivery for most items.',
      'product_recommendations': 'Based on your previous purchases, I recommend checking out our new winter collection. You might like the wool blend cardigan or the cashmere scarf that pairs well with your style.',
      'delivery_inquiry': 'Your order is expected to arrive between January 25-27th. We offer free standard shipping (5-7 days) or express shipping (2-3 days) for $9.99.'
    }
  },
  {
    id: 'payment-processor',
    name: 'Payment Processor',
    description: 'Automates payment processing, subscription management, and billing inquiries',
    category: 'payments',
    api: 'Stripe',
    status: 'active',
    metrics: {
      interactions: 1923,
      successRate: 98.7,
      avgResponseTime: 0.8,
      costSavings: 23400,
      timeAutomated: 89
    },
    capabilities: [
      'Process one-time payments',
      'Manage subscriptions',
      'Handle billing inquiries',
      'Process refunds',
      'Update payment methods'
    ],
    sampleQueries: [
      'Process a $50 payment for customer John Doe',
      'Cancel my subscription',
      'Why was my card declined?',
      'I need a refund for my last payment',
      'Update my payment method'
    ],
    responses: {
      'process_payment': 'Payment of $50.00 has been successfully processed for John Doe. Transaction ID: pi_1234567890. The customer will receive a receipt via email.',
      'cancel_subscription': 'I\'ve located your subscription. It\'s currently active and will renew on February 15th for $29.99. Would you like me to cancel it immediately or at the end of the current billing period?',
      'card_declined': 'Your card was declined due to insufficient funds. Please check your account balance or try a different payment method. You can update your payment information in your account settings.',
      'process_refund': 'I can process a refund for your last payment of $29.99 made on January 15th. Refunds typically take 5-10 business days to appear on your statement. Shall I proceed?',
      'update_payment': 'I can help you update your payment method. For security, I\'ll need to redirect you to our secure payment portal. Would you like me to send you the link?'
    }
  },
  {
    id: 'team-communicator',
    name: 'Team Communicator',
    description: 'Facilitates team communication, manages channels, and automates notifications',
    category: 'communication',
    api: 'Slack',
    status: 'active',
    metrics: {
      interactions: 3156,
      successRate: 94.8,
      avgResponseTime: 1.1,
      costSavings: 18900,
      timeAutomated: 167
    },
    capabilities: [
      'Send messages to channels',
      'Manage team members',
      'Schedule notifications',
      'File sharing and management',
      'Create and manage channels'
    ],
    sampleQueries: [
      'Send a message to the #general channel',
      'Who\'s in the marketing team?',
      'Schedule a reminder for tomorrow\'s meeting',
      'Share the project files with the dev team',
      'Create a new channel for the Q1 project'
    ],
    responses: {
      'send_message': 'Message sent to #general: "Team standup meeting at 10 AM in Conference Room A. Please bring your weekly reports." 15 team members will be notified.',
      'team_members': 'The marketing team has 8 members: Sarah (Manager), Mike (Content), Lisa (Design), Tom (Analytics), Emma (Social), Jake (SEO), Amy (Email), and Chris (Campaigns).',
      'schedule_reminder': 'Reminder scheduled for tomorrow at 9:00 AM: "Team meeting in 1 hour - Conference Room A". I\'ll notify all participants 1 hour before the meeting.',
      'share_files': 'I\'ve shared the project files (design_mockups.zip, requirements.pdf, timeline.xlsx) with the #dev-team channel. 12 developers have been notified.',
      'create_channel': 'Created new private channel #q1-project-2024. I\'ve added the project leads: Sarah, Mike, and Tom. Would you like me to add anyone else?'
    }
  }
]

export const businessMetrics = {
  totalCostSavings: 57900,
  totalTimeAutomated: 398,
  totalInteractions: 7926,
  averageSuccessRate: 96.6,
  averageResponseTime: 1.1,
  monthlyGrowth: 23.4,
  customerSatisfaction: 4.8,
  automationEfficiency: 94.2
}

export const usageAnalytics = {
  dailyInteractions: [
    { date: '2024-01-15', interactions: 245, success: 234 },
    { date: '2024-01-16', interactions: 289, success: 278 },
    { date: '2024-01-17', interactions: 312, success: 301 },
    { date: '2024-01-18', interactions: 267, success: 258 },
    { date: '2024-01-19', interactions: 334, success: 322 },
    { date: '2024-01-20', interactions: 298, success: 287 },
    { date: '2024-01-21', interactions: 356, success: 343 }
  ],
  topEndpoints: [
    { endpoint: '/orders/status', calls: 1247, success: 1198 },
    { endpoint: '/products/search', calls: 1089, success: 1067 },
    { endpoint: '/payments/process', calls: 923, success: 911 },
    { endpoint: '/customers/info', calls: 756, success: 734 },
    { endpoint: '/messages/send', calls: 689, success: 665 }
  ],
  responseTimeDistribution: [
    { range: '0-0.5s', count: 3245 },
    { range: '0.5-1s', count: 2876 },
    { range: '1-2s', count: 1456 },
    { range: '2-5s', count: 289 },
    { range: '5s+', count: 60 }
  ]
}

export const deploymentTemplates = [
  {
    id: 'webhook-integration',
    name: 'Webhook Integration',
    description: 'Receive and process incoming webhooks',
    code: `// Auto-generated webhook handler
app.post('/webhook/agent/:agentId', async (req, res) => {
  const { agentId } = req.params;
  const payload = req.body;
  
  try {
    const agent = await getAgent(agentId);
    const response = await agent.process(payload);
    res.json({ success: true, response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`
  },
  {
    id: 'chat-widget',
    name: 'Chat Widget',
    description: 'Embeddable chat widget for websites',
    code: `<!-- Embed this in your website -->
<script src="https://livelyapi.com/widget.js"></script>
<script>
  LivelyAPI.init({
    agentId: 'your-agent-id',
    apiKey: 'your-api-key',
    theme: 'modern',
    position: 'bottom-right'
  });
</script>`
  },
  {
    id: 'api-endpoint',
    name: 'REST API Endpoint',
    description: 'Direct API access for custom integrations',
    code: `// Example API usage
const response = await fetch('https://api.livelyapi.com/v1/agents/your-agent-id/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-api-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'Hello, how can you help me?',
    userId: 'user-123'
  })
});

const result = await response.json();
console.log(result.response);`
  }
]