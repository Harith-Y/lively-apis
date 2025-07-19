"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var api_analyzer_1 = require("../../lib/api-analyzer");
var agent_planner_1 = require("../../lib/agent-planner");
var ai_integration_1 = require("../../lib/ai-integration");
function testAgentBuilder() {
    return __awaiter(this, void 0, void 0, function () {
        var userPrompt, apiAnalyzer, parsedAPI, planner, agentPlan, aiIntegration, testResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userPrompt = 'Try to send the lowest stock items from shopify to my mail.';
                    apiAnalyzer = new api_analyzer_1.APIAnalyzer();
                    return [4 /*yield*/, apiAnalyzer.analyzeAPI('shopify')];
                case 1:
                    parsedAPI = _a.sent();
                    planner = new agent_planner_1.AgentPlanner(parsedAPI);
                    return [4 /*yield*/, planner.planAgent(userPrompt)];
                case 2:
                    agentPlan = _a.sent();
                    // Step 3: (Optional) Print the generated plan for inspection
                    console.log('Generated Agent Plan:', JSON.stringify(agentPlan, null, 2));
                    aiIntegration = new ai_integration_1.AIIntegration();
                    return [4 /*yield*/, aiIntegration.testAgent(agentPlan, userPrompt)];
                case 3:
                    testResult = _a.sent();
                    console.log('Test Agent Result:', testResult);
                    return [2 /*return*/];
            }
        });
    });
}
testAgentBuilder().catch(console.error);
