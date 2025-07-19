'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, 
  Zap, 
  Shield, 
  Gauge, 
  MessageSquare, 
  Code, 
  BarChart3, 
  ArrowRight,
  Sparkles,
  Star,
  CheckCircle,
  Users,
  Building,
  Award,
  Lock,
  Globe,
  Cpu,
  Database,
  Cloud,
  Calendar,
  Play
} from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: MessageSquare,
    title: 'Natural Language Builder',
    description: 'Describe your workflow in plain English and watch AI generate your agent automatically.'
  },
  {
    icon: Code,
    title: 'Any API Integration',
    description: 'Connect to REST APIs, GraphQL, webhooks, and databases with zero coding required.'
  },
  {
    icon: Gauge,
    title: 'Real-time Testing',
    description: 'Test your agents instantly with our interactive playground before deployment.'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade security with SOC 2 compliance and end-to-end encryption.'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Monitor performance, track usage, and optimize your agents with detailed insights.'
  },
  {
    icon: Zap,
    title: 'One-Click Deploy',
    description: 'Deploy your agents to production with a single click and scale automatically.'
  }
]

const stats = [
  { label: 'APIs Connected', value: '10,000+' },
  { label: 'Agents Created', value: '50,000+' },
  { label: 'Enterprise Customers', value: '500+' },
  { label: 'Uptime SLA', value: '99.9%' }
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CTO',
    company: 'TechFlow Inc',
    avatar: 'SC',
    content: 'LivelyAPI transformed our customer support. We built our first AI agent in 30 minutes and reduced response time by 85%.',
    rating: 5,
    metrics: '85% faster responses'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Head of Operations',
    company: 'RetailMax',
    avatar: 'MR',
    content: 'The ROI was immediate. Our payment processing agent handles 2,000+ transactions daily with 99.7% accuracy.',
    rating: 5,
    metrics: '$47K monthly savings'
  },
  {
    name: 'Emily Watson',
    role: 'VP Engineering',
    company: 'CloudScale',
    avatar: 'EW',
    content: 'Integration was seamless. Our Slack agent manages team communications for 500+ employees across 12 time zones.',
    rating: 5,
    metrics: '12 hours saved daily'
  }
]

const pricingTiers = [
  {
    name: 'Starter',
    price: 99,
    description: 'Perfect for small teams getting started',
    features: [
      '3 AI agents',
      '10,000 interactions/month',
      'Basic analytics',
      'Email support',
      'Standard integrations'
    ],
    metrics: {
      savings: '$2,400',
      timeAutomated: '15 hours',
      roi: '2,400%'
    },
    popular: false
  },
  {
    name: 'Professional',
    price: 299,
    description: 'For growing businesses with complex workflows',
    features: [
      '15 AI agents',
      '100,000 interactions/month',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
      'Workflow automation',
      'Team collaboration'
    ],
    metrics: {
      savings: '$12,000',
      timeAutomated: '80 hours',
      roi: '4,000%'
    },
    popular: true
  },
  {
    name: 'Enterprise',
    price: 999,
    description: 'For large organizations with enterprise needs',
    features: [
      'Unlimited AI agents',
      'Unlimited interactions',
      'Enterprise analytics',
      'Dedicated support',
      'Custom development',
      'SLA guarantees',
      'Advanced security',
      'Multi-region deployment'
    ],
    metrics: {
      savings: '$50,000',
      timeAutomated: '300 hours',
      roi: '5,000%'
    },
    popular: false
  }
]

const integrations = [
  { name: 'Stripe', logo: '💳', category: 'Payments' },
  { name: 'Shopify', logo: '🛍️', category: 'E-commerce' },
  { name: 'Slack', logo: '💬', category: 'Communication' },
  { name: 'Salesforce', logo: '☁️', category: 'CRM' },
  { name: 'HubSpot', logo: '🎯', category: 'Marketing' },
  { name: 'Zendesk', logo: '🎧', category: 'Support' },
  { name: 'Notion', logo: '📝', category: 'Productivity' },
  { name: 'Airtable', logo: '📊', category: 'Database' }
]

const securityFeatures = [
  { icon: Shield, title: 'SOC 2 Compliant', description: 'Enterprise-grade security standards' },
  { icon: Lock, title: 'End-to-End Encryption', description: 'All data encrypted in transit and at rest' },
  { icon: Award, title: 'ISO 27001 Certified', description: 'International security management standards' },
  { icon: Globe, title: 'GDPR Compliant', description: 'Full compliance with data protection regulations' }
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 min-h-screen flex items-center">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute top-3/4 right-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Built for Suprathon 2025
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
            >
              Transform{' '}
              <motion.span 
                className="gradient-text"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                APIs
              </motion.span>
              {' '}into{' '}
              <motion.span 
                className="gradient-text"
                animate={{ 
                  backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'],
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                AI Agents
              </motion.span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Revolutionary no-code platform that converts any API into intelligent conversational agents. 
              Build, test, and deploy in minutes, not months.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-4 shadow-lg">
                  <Link href="/builder">
                    <Bot className="w-5 h-5 mr-2" />
                    Start Building Free
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 border-2 hover:bg-white/50 backdrop-blur-sm">
                  <Link href="#demo">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Demo
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30"
                >
                  <motion.div 
                    className="text-2xl md:text-3xl font-bold text-purple-600 mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 + index * 0.1, type: "spring" }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by{' '}
              <span className="gradient-text">industry leaders</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how companies are transforming their operations with AI agents
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-purple-600">{testimonial.company}</div>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="text-sm font-medium text-green-800">{testimonial.metrics}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent{' '}
              <span className="gradient-text">pricing</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your business needs. All plans include our core AI agent platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className={`relative bg-white p-8 rounded-xl shadow-lg border-2 transition-all duration-300 ${
                  tier.popular 
                    ? 'border-purple-600 shadow-xl' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <p className="text-gray-600 mb-4">{tier.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">${tier.price}</span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="text-sm text-gray-600 mb-2">Expected Monthly Impact:</div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Cost Savings:</span>
                      <span className="font-semibold text-green-600">{tier.metrics.savings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Time Automated:</span>
                      <span className="font-semibold text-blue-600">{tier.metrics.timeAutomated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ROI:</span>
                      <span className="font-semibold text-purple-600">{tier.metrics.roi}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  className={`w-full ${
                    tier.popular 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  asChild
                >
                  <Link href="/auth/signup">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Marketplace */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Connect with{' '}
              <span className="gradient-text">any platform</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pre-built integrations with popular business tools and APIs
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="text-3xl mb-3">{integration.logo}</div>
                <div className="font-semibold text-gray-900 mb-1">{integration.name}</div>
                <div className="text-sm text-gray-600">{integration.category}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Enterprise-grade{' '}
              <span className="gradient-text">security</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your data and integrations are protected by industry-leading security standards
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for{' '}
              <span className="gradient-text">scale</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Modern architecture designed for enterprise performance and reliability
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Cpu className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Processing Layer</h3>
              <p className="text-gray-600">
                Advanced natural language processing with GPT-4 and Claude integration for intelligent agent responses
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Database className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-time Data Engine</h3>
              <p className="text-gray-600">
                High-performance database with real-time synchronization and advanced analytics capabilities
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Cloud className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Global Infrastructure</h3>
              <p className="text-gray-600">
                Multi-region deployment with 99.9% uptime SLA and automatic scaling for peak performance
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Demo CTA Section */}
      <section id="demo" className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              See LivelyAPI in action
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Book a personalized demo and see how AI agents can transform your business operations in just 15 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-purple-600 hover:bg-gray-100">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Demo Call
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-purple-600">
                  <Link href="/playground">
                    <Play className="w-5 h-5 mr-2" />
                    Try Interactive Demo
                  </Link>
                </Button>
              </motion.div>
            </div>
            
            <div className="mt-8 text-purple-100 text-sm">
              <p>✓ No credit card required  ✓ 15-minute setup  ✓ Immediate ROI demonstration</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to build{' '}
              <span className="gradient-text">intelligent agents</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From natural language processing to enterprise-grade security, 
              LivelyAPI provides all the tools you need to create powerful AI agents.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              From API to Agent in{' '}
              <span className="gradient-text">3 simple steps</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intuitive workflow makes it easy for anyone to create powerful AI agents, 
              regardless of technical expertise.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Your API',
                description: 'Simply paste your API endpoint or upload your OpenAPI spec. Our system automatically understands your API structure.',
                icon: Code
              },
              {
                step: '02',
                title: 'Describe Your Agent',
                description: 'Tell us what you want your agent to do in plain English. Our AI will generate the conversation flow automatically.',
                icon: MessageSquare
              },
              {
                step: '03',
                title: 'Test & Deploy',
                description: 'Test your agent in our playground, then deploy to production with a single click. Monitor and optimize in real-time.',
                icon: Zap
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to transform your APIs?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Join thousands of developers and enterprises who are already building 
              the future of API automation with LivelyAPI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-4 bg-white text-purple-600 hover:bg-gray-100">
                  <Link href="/builder">
                    Start Building Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-purple-600">
                  <Link href="/templates">
                    View Templates
                  </Link>
                </Button>
              </motion.div>
            </div>
            
            <div className="mt-8 text-purple-100 text-sm">
              <p>🚀 Deploy in 5 minutes  💰 See ROI in 30 days  🔒 Enterprise security included</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}