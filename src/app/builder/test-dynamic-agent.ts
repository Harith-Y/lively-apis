import { APIAnalyzer } from '../../lib/api-analyzer';
import { AgentPlanner } from '../../lib/agent-planner';
import { executeAgentFunctionCalls, FunctionCall } from '../../lib/ai-integration';

async function testDynamicAgent() {
  // 1. Analyze the Shopify API (using the built-in analyzer)
  const apiAnalyzer = new APIAnalyzer();
  const parsedAPI = await apiAnalyzer.analyzeAPI('shopify');

  // 2. Generate an agent plan for the multi-step workflow
  const planner = new AgentPlanner(parsedAPI);
  // Remove unused variable 'plan' at line 12

  // 3. Simulate what an LLM would return (function calls)
  // In a real system, you'd get this from OpenAI function-calling or similar
  const functionCalls: FunctionCall[] = [
    {
      name: 'getLowestStockItems',
      parameters: { limit: 3 },
    },
    {
      name: 'sendEmail',
      parameters: {
        to: 'demo@example.com',
        subject: 'Lowest Stock Items',
        body: 'Here are your lowest stock items: ...', // In a real run, you'd use the previous result
      },
    },
  ];

  // 4. Provide fake credentials for demo
  const apiCredentials = { apiKey: 'demo', token: 'demo' };

  // 5. Execute the agent plan dynamically
  const results = await executeAgentFunctionCalls(functionCalls, parsedAPI, apiCredentials);

  // 6. Show the results
  console.log('Dynamic Agent Execution Results:', results);
}

testDynamicAgent().catch(console.error);
