const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { AIIntegration } = require('./ai-integration');
const fetch = require('node-fetch');

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

// === PLAN AGENT ENDPOINT ===
app.post('/api/plan-agent', async (req, res) => {
  const { parsedAPI, prompt, provider } = req.body;
  if (!parsedAPI || !prompt) {
    return res.status(400).json({ error: 'Missing parsedAPI or prompt' });
  }
  try {
    // Choose provider
    const useGroq = provider === 'groq' || (!provider && process.env.GROQ_API_KEY);
    const useOpenRouter = provider === 'openrouter' || (!useGroq && process.env.OPENROUTER_API_KEY);
    let llmRes;
    const systemPrompt = `You are an expert AI agent designer. Given an API spec and a user goal, generate a JSON agent plan with a workflow of steps (including endpoint, method, input/output mapping, and natural language intent). Output only valid JSON.`;
    const userPrompt = `API Spec (JSON):\n${JSON.stringify(parsedAPI, null, 2)}\n\nUser Goal: ${prompt}\n\nGenerate a JSON agent plan with a workflow of steps to accomplish the goal using the API. Output only valid JSON.`;
    if (useGroq) {
      llmRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.2,
          max_tokens: 2048
        })
      });
    } else if (useOpenRouter) {
      llmRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.2,
          max_tokens: 2048
        })
      });
    } else {
      return res.status(500).json({ error: 'No LLM provider/API key configured' });
    }
    const llmText = await llmRes.text();
    if (!llmRes.ok) {
      console.error('LLM API error:', llmText);
      return res.status(500).json({ error: 'LLM API error', raw: llmText });
    }
    let llmData;
    try {
      llmData = JSON.parse(llmText);
    } catch (e) {
      console.error('LLM did not return JSON:', llmText);
      return res.status(500).json({ error: 'LLM did not return JSON', raw: llmText });
    }
    let planText = llmData.choices?.[0]?.message?.content || llmData.choices?.[0]?.text || '';
    // Try to parse JSON from the LLM output
    let plan;
    try {
      plan = JSON.parse(planText);
    } catch (e) {
      // Try to extract JSON substring
      const match = planText.match(/\{[\s\S]*\}/);
      if (match) {
        try { plan = JSON.parse(match[0]); } catch { plan = null; }
      }
    }
    if (!plan) {
      return res.status(500).json({ error: 'LLM did not return valid JSON', raw: planText });
    }
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate agent plan', details: err.message });
  }
});

// === GENERATE CODE ENDPOINT (REAL IMPLEMENTATION) ===
app.post('/generate-code', async (req, res) => {
  const { agentPlan, agentName, apiEndpoint, provider } = req.body;
  if (!agentPlan || !apiEndpoint) {
    return res.status(400).json({ error: 'Missing agentPlan or apiEndpoint' });
  }
  try {
    // Choose provider
    const useGroq = provider === 'groq' || (!provider && process.env.GROQ_API_KEY);
    const useOpenRouter = provider === 'openrouter' || (!useGroq && process.env.OPENROUTER_API_KEY);
    let llmRes;
    const systemPrompt = `You are an expert Node.js/Express developer. Given an agent plan (JSON) and API endpoint, generate a production-ready Node.js Express route handler that implements the agent workflow. Use axios for HTTP calls. Output only code, no explanation.`;
    const userPrompt = `Agent Name: ${agentName || 'Untitled Agent'}\nAPI Endpoint: ${apiEndpoint}\n\nAgent Plan (JSON):\n${JSON.stringify(agentPlan, null, 2)}\n\nGenerate a Node.js Express route handler that implements the agent workflow. Use axios for HTTP calls. Output only code.`;
    if (useGroq) {
      llmRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.2,
          max_tokens: 2048
        })
      });
    } else if (useOpenRouter) {
      llmRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.2-3b-instruct:free',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.2,
          max_tokens: 2048
        })
      });
    } else {
      return res.status(500).json({ error: 'No LLM provider/API key configured' });
    }
    const llmText2 = await llmRes.text();
    if (!llmRes.ok) {
      console.error('LLM API error:', llmText2);
      return res.status(500).json({ error: 'LLM API error', raw: llmText2 });
    }
    let llmData2;
    try {
      llmData2 = JSON.parse(llmText2);
    } catch (e) {
      console.error('LLM did not return JSON:', llmText2);
      return res.status(500).json({ error: 'LLM did not return JSON', raw: llmText2 });
    }
    let code = llmData2.choices?.[0]?.message?.content || llmData2.choices?.[0]?.text || '';
    // Remove code block markers if present
    code = code.replace(/^```[a-z]*\n?/i, '').replace(/```$/, '').trim();
    if (!code) {
      return res.status(500).json({ error: 'LLM did not return code', raw: llmData2 });
    }
    res.json({ code });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate code', details: err.message });
  }
});

// Automated API Discovery endpoint
app.post('/suggest-apis', async (req, res) => {
  const { prompt, description } = req.body;
  const text = (prompt || description || '').toLowerCase();
  if (!text) return res.json([]);
  // Use ilike for name/description, and overlap for tags
  const { data, error } = await supabase
    .from('api_catalog')
    .select('*')
    .or(
      `name.ilike.%${text}%,description.ilike.%${text}%,tags.cs.{${text
        .split(' ')
        .map((t) => `"${t}"`)
        .join(',')}}`
    )
    .limit(10);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
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

// Get agent by ID for refinement
app.get('/agents/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('agents').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

// MCP Server Management endpoints
app.get('/api/mcp-servers', async (req, res) => {
  let token = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.replace('Bearer ', '');
  } else if (req.cookies && req.cookies['sb-access-token']) {
    token = req.cookies['sb-access-token'];
  }
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData || !userData.user) {
    return res.status(401).json({ error: 'Invalid user' });
  }
  const user_id = userData.user.id;
  const { data, error } = await supabase
    .from('mcp_servers')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/mcp-servers', async (req, res) => {
  let token = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.replace('Bearer ', '');
  } else if (req.cookies && req.cookies['sb-access-token']) {
    token = req.cookies['sb-access-token'];
  }
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData || !userData.user) {
    return res.status(401).json({ error: 'Invalid user' });
  }
  const user_id = userData.user.id;
  const { name, url } = req.body;
  if (!name || !url) return res.status(400).json({ error: 'Missing name or url' });
  const { data, error } = await supabase
    .from('mcp_servers')
    .insert([{ user_id, name, url }])
    .select('*')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Analytics endpoint
app.get('/api/analytics', async (req, res) => {
  let token = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.replace('Bearer ', '');
  } else if (req.cookies && req.cookies['sb-access-token']) {
    token = req.cookies['sb-access-token'];
  }
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData || !userData.user) {
    return res.status(401).json({ error: 'Invalid user' });
  }
  const user_id = userData.user.id;
  // Aggregate analytics for this user
  const { data, error } = await supabase
    .from('agent_analytics')
    .select('interactions, success_rate, avg_response_time')
    .eq('user_id', user_id);
  if (error) return res.status(500).json({ error: error.message });
  let agentInvocations = 0, totalSuccess = 0, totalResp = 0, count = 0;
  if (Array.isArray(data)) {
    data.forEach(row => {
      agentInvocations += row.interactions || 0;
      totalSuccess += row.success_rate || 0;
      totalResp += row.avg_response_time || 0;
      count++;
    });
  }
  const avgSuccessRate = count ? (totalSuccess / count) : 0;
  const avgResponseTime = count ? (totalResp / count) : 0;
  res.json({
    agentInvocations,
    successRate: avgSuccessRate,
    avgResponseTime,
    uptime: 99.9
  });
});

// Submit agent feedback
app.post('/agent-feedback', async (req, res) => {
  let token = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.replace('Bearer ', '');
  } else if (req.cookies && req.cookies['sb-access-token']) {
    token = req.cookies['sb-access-token'];
  }
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData || !userData.user) {
    return res.status(401).json({ error: 'Invalid user' });
  }
  const user_id = userData.user.id;
  const { agent_id, feedback, rating } = req.body;
  if (!agent_id || !feedback) return res.status(400).json({ error: 'Missing agent_id or feedback' });
  const { data, error } = await supabase
    .from('agent_feedback')
    .insert([{ agent_id, user_id, feedback, rating }])
    .select('*')
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get feedback for an agent
app.get('/agent-feedback/:agent_id', async (req, res) => {
  const { agent_id } = req.params;
  const { data, error } = await supabase
    .from('agent_feedback')
    .select('*')
    .eq('agent_id', agent_id)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get all versions of an agent (by name and user)
app.get('/agents/:id/versions', async (req, res) => {
  const { id } = req.params;
  // Get the agent to find name and user_id
  const { data: agent, error: agentError } = await supabase.from('agents').select('name,user_id').eq('id', id).single();
  if (agentError || !agent) return res.status(404).json({ error: 'Agent not found' });
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .eq('user_id', agent.user_id)
    .eq('name', agent.name)
    .order('version', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Deploy agent to Vercel
app.post('/deploy/vercel', async (req, res) => {
  const { code, agentName } = req.body;
  if (!code || !agentName) return res.status(400).json({ error: 'Missing code or agentName' });
  const vercelToken = process.env.VERCEL_TOKEN;
  if (!vercelToken) return res.status(500).json({ error: 'Vercel token not set in backend' });
  const projectName = `agent-${agentName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
  const files = [
    {
      file: 'api/agent.js',
      data: Buffer.from(code).toString('base64'),
      encoding: 'base64'
    },
    {
      file: 'package.json',
      data: Buffer.from(JSON.stringify({
        name: projectName,
        version: '1.0.0',
        main: 'api/agent.js',
        dependencies: { axios: '^1.6.0' }
      })).toString('base64'),
      encoding: 'base64'
    }
  ];
  try {
    const response = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: projectName,
        files,
        projectSettings: { framework: null },
        builds: [{ src: 'api/agent.js', use: '@vercel/node' }]
      })
    });
    const data = await response.json();
    if (data.url) {
      res.json({ url: `https://${data.url}` });
    } else {
      res.status(500).json({ error: data.error?.message || 'Vercel deployment failed', details: data });
    }
  } catch (err) {
    res.status(500).json({ error: 'Vercel deployment error', details: err.message });
  }
});

// Groq TTS proxy endpoint
app.post('/tts/groq', async (req, res) => {
  const { text, voice = 'alloy', model = 'tts-1' } = req.body;
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) return res.status(500).json({ error: 'Groq API key not set' });
  if (!text) return res.status(400).json({ error: 'Missing text' });
  try {
    const groqRes = await fetch('https://api.groq.com/v1/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqApiKey}`
      },
      body: JSON.stringify({ text, voice, model })
    });
    const data = await groqRes.json();
    if (data && data.audio_url) {
      res.json({ audio_url: data.audio_url });
    } else {
      res.status(500).json({ error: data.error || 'Groq TTS failed', details: data });
    }
  } catch (err) {
    res.status(500).json({ error: 'Groq TTS error', details: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
}); 