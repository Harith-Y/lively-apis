import { APIAnalyzer } from '@/lib/api-analyzer';
import { AgentPlanner } from '@/lib/agent-planner';
import { AIIntegration } from '@/lib/ai-integration';

async function testAgentBuilder() {
  // User's natural language request
  const userPrompt = 'Try to send the lowest stock items from shopify to my mail.';

  // Step 1: Analyze the API (Shopify)
  const apiAnalyzer = new APIAnalyzer();
  const parsedAPI = await apiAnalyzer.analyzeAPI('shopify');

  // Step 2: Generate the agent plan
  const planner = new AgentPlanner(parsedAPI);
  const agentPlan = await planner.planAgent(userPrompt);

  // Step 3: (Optional) Print the generated plan for inspection
  console.log('Generated Agent Plan:', JSON.stringify(agentPlan, null, 2));

  // Step 4: (Optional) Test the agent (mocked for now)
  const aiIntegration = new AIIntegration();
  const testResult = await aiIntegration.testAgent(agentPlan, userPrompt);
  console.log('Test Agent Result:', testResult);
}

testAgentBuilder().catch(console.error);
