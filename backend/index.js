const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.post('/feedback', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const { error } = await supabase.from('feedback').insert([{ name, email, message }]);
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ success: true });
});

// Signup endpoint
app.post('/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { name }
  });
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(200).json({ user: data.user });
});

// Signin endpoint
app.post('/auth/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return res.status(401).json({ error: error.message });
  }
  res.status(200).json({ user: data.user, session: data.session });
});

// Playground agent response endpoint
app.post('/playground/agent-response', async (req, res) => {
  const { agentId, agentPlan, message } = req.body;
  // TODO: Integrate with your AI provider here
  // For now, return a mock response
  if (!agentId || !agentPlan || !message) {
    return res.status(400).json({ agentResponse: 'Missing required fields.' });
  }
  // Example: Call your AI provider here and get a response
  // const aiResponse = await callAIProvider(agentPlan, message);
  // return res.json({ agentResponse: aiResponse });

  // Mock response for demonstration
  return res.json({ agentResponse: `This is a mock AI response to: "${message}" for agent ${agentId}.` });
});

// /auth/me endpoint for frontend auth state check
app.get('/auth/me', async (req, res) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.replace('Bearer ', '');
    } else if (req.cookies && req.cookies['sb-access-token']) {
      token = req.cookies['sb-access-token'];
    }
    console.log('Token received in /auth/me:', token);
    if (!token) {
      return res.json({ user: null });
    }
    const { data, error } = await supabase.auth.getUser(token);
    console.log('Supabase user:', data, 'Error:', error);
    if (error || !data || !data.user) {
      return res.json({ user: null });
    }
    return res.json({ user: data.user });
  } catch (err) {
    console.error('Error in /auth/me:', err);
    return res.json({ user: null });
  }
});

app.post('/auth/signout', (req, res) => {
  res.clearCookie('sb-access-token', { path: '/' });
  res.json({ success: true });
});

// API Docs endpoint
app.get('/api-docs', (req, res) => {
  res.json({
    endpoints: [
      {
        path: '/feedback',
        method: 'POST',
        description: 'Submit feedback (contact form)',
        request: { name: 'string', email: 'string', message: 'string' },
        response: { success: 'boolean' }
      },
      {
        path: '/auth/signup',
        method: 'POST',
        description: 'Sign up a new user',
        request: { name: 'string', email: 'string', password: 'string' },
        response: { user: 'object' }
      },
      {
        path: '/auth/signin',
        method: 'POST',
        description: 'Sign in a user',
        request: { email: 'string', password: 'string' },
        response: { user: 'object', session: 'object' }
      },
      {
        path: '/auth/signout',
        method: 'POST',
        description: 'Sign out the current user (clears cookie)',
        response: { success: 'boolean' }
      },
      {
        path: '/auth/me',
        method: 'GET',
        description: 'Get the current authenticated user',
        response: { user: 'object|null' }
      },
      {
        path: '/playground/agent-response',
        method: 'POST',
        description: 'Get an AI agent response for a message',
        request: { agentId: 'string', agentPlan: 'object', message: 'string' },
        response: { agentResponse: 'string' }
      }
    ]
  })
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
}); 