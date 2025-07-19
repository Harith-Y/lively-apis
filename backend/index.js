const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { AIIntegration } = require('./ai-integration');

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

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
  // No cookie logic; return token in response only
  res.status(200).json({ user: data.user, session: data.session });
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
  // No cookie logic; return token in response only
  res.status(200).json({ user: data.user, session: data.session });
});

app.post('/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  // Supabase will send a password reset email
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: process.env.PASSWORD_RESET_REDIRECT_URL
  });
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json({ success: true });
});

app.post('/auth/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: 'Missing token or password.' });
  }
  // Use Supabase to update the user's password
  const { data, error } = await supabase.auth.updateUser({ password }, { accessToken: token });
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  // If a new session/access_token is returned, include it in the response
  res.json({ success: true, session: data.session });
});

// Playground agent response endpoint
app.post('/playground/agent-response', async (req, res) => {
  const { agentId, agentPlan, message, temperature, maxTokens, provider, apiKey } = req.body;
  if (!agentId || !agentPlan || !message) {
    return res.status(400).json({ agentResponse: 'Missing required fields.' });
  }
  try {
    const ai = new AIIntegration(provider || 'openrouter', apiKey, temperature, maxTokens);
    const agentResponse = await ai.executeAgent(agentPlan, message, agentPlan.api, agentPlan.apiCredentials);
    return res.json({ agentResponse: agentResponse.agentResponse });
  } catch (error) {
    console.error('AI agent error:', error);
    return res.status(500).json({ agentResponse: 'Error generating AI response.' });
  }
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
  // No cookie logic; just respond
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
        description: 'Get a real AI agent response for a message using the provided agent plan and message.',
        request: { agentId: 'string', agentPlan: 'object', message: 'string' },
        response: { agentResponse: 'string' }
      }
    ]
  })
})

// Add the /api/templates endpoint
app.get('/api/templates', async (req, res) => {
  console.log('Received request for /api/templates');
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .limit(20); // Add a limit for safety
  if (error) {
    console.error('Supabase error:', error);
    return res.status(500).json({ error: error.message });
  }
  console.log('Templates data:', data);
  res.json(data);
});

// Add the /agents endpoint
app.post('/agents', async (req, res) => {
  try {
    // Get access token from Authorization header or cookie
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.replace('Bearer ', '');
    } else if (req.cookies && req.cookies['sb-access-token']) {
      token = req.cookies['sb-access-token'];
    }
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    // Get user from Supabase
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData || !userData.user) {
      return res.status(401).json({ error: 'Invalid user' });
    }
    const user_id = userData.user.id;
    const { name, description, api_endpoint, configuration } = req.body;
    if (!name || !api_endpoint || !configuration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Insert agent into Supabase
    const { data, error } = await supabase
      .from('agents')
      .insert([
        {
          user_id,
          name,
          description,
          api_endpoint,
          configuration,
          status: 'active',
        },
      ])
      .select('id')
      .single();
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ id: data.id });
  } catch (err) {
    console.error('Error in /agents:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
}); 