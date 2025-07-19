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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentPlanner = void 0;
var AgentPlanner = /** @class */ (function () {
    function AgentPlanner(api) {
        this.api = api;
    }
    AgentPlanner.prototype.planAgent = function (userGoal) {
        return __awaiter(this, void 0, void 0, function () {
            var workflow, systemPrompt, functionDefinitions, conversationFlow;
            return __generator(this, function (_a) {
                workflow = this.createWorkflow(userGoal);
                systemPrompt = this.generateSystemPrompt(workflow);
                functionDefinitions = this.generateFunctionDefinitions();
                conversationFlow = this.generateConversationFlow(workflow);
                return [2 /*return*/, {
                        workflow: workflow,
                        systemPrompt: systemPrompt,
                        functionDefinitions: functionDefinitions,
                        conversationFlow: conversationFlow
                    }];
            });
        });
    };
    AgentPlanner.prototype.findRelevantEndpoints = function (goal) {
        var _this = this;
        var goalLower = goal.toLowerCase();
        var scoredEndpoints = this.api.endpoints.map(function (endpoint) {
            var score = 0;
            // Check if goal mentions endpoint path or summary
            if (goalLower.includes(endpoint.path.toLowerCase().replace(/[{}]/g, ''))) {
                score += 10;
            }
            if (goalLower.includes(endpoint.summary.toLowerCase())) {
                score += 8;
            }
            // Check tags
            endpoint.tags.forEach(function (tag) {
                if (goalLower.includes(tag.toLowerCase())) {
                    score += 6;
                }
            });
            // Check common patterns
            if (_this.api.name === 'Stripe') {
                if (goalLower.includes('payment') && endpoint.path.includes('payment'))
                    score += 10;
                if (goalLower.includes('customer') && endpoint.path.includes('customer'))
                    score += 10;
                if (goalLower.includes('subscription') && endpoint.path.includes('subscription'))
                    score += 10;
            }
            if (_this.api.name === 'Shopify') {
                if (goalLower.includes('order') && endpoint.path.includes('order'))
                    score += 10;
                if (goalLower.includes('product') && endpoint.path.includes('product'))
                    score += 10;
                if (goalLower.includes('customer') && endpoint.path.includes('customer'))
                    score += 10;
            }
            if (_this.api.name === 'Slack') {
                if (goalLower.includes('message') && endpoint.path.includes('chat'))
                    score += 10;
                if (goalLower.includes('channel') && endpoint.path.includes('channel'))
                    score += 10;
                if (goalLower.includes('user') && endpoint.path.includes('user'))
                    score += 10;
            }
            return { endpoint: endpoint, score: score };
        });
        // Return endpoints with score > 0, sorted by relevance
        return scoredEndpoints
            .filter(function (item) { return item.score > 0; })
            .sort(function (a, b) { return b.score - a.score; })
            .slice(0, 5) // Limit to top 5 most relevant
            .map(function (item) { return item.endpoint; });
    };
    AgentPlanner.prototype.createWorkflow = function (goal) {
        var _this = this;
        var steps = [];
        // Add greeting step
        steps.push({
            id: 'greeting',
            type: 'response',
            title: 'Greeting',
            description: 'Welcome the user and explain capabilities',
            responseTemplate: this.generateGreeting(goal),
            nextSteps: ['input']
        });
        // Add input collection step
        steps.push({
            id: 'input',
            type: 'input',
            title: 'Collect Information',
            description: 'Gather required information from user',
            nextSteps: ['process']
        });
        // Add processing steps for each relevant endpoint
        this.findRelevantEndpoints(goal).forEach(function (endpoint, index) {
            var stepId = "api_call_".concat(index);
            steps.push({
                id: stepId,
                type: 'api_call',
                title: "".concat(endpoint.summary),
                description: endpoint.description,
                endpoint: endpoint,
                parameters: _this.generateParameterMapping(endpoint),
                nextSteps: ["response_".concat(index)]
            });
            steps.push({
                id: "response_".concat(index),
                type: 'response',
                title: "Respond with ".concat(endpoint.summary, " results"),
                description: "Format and present the results from ".concat(endpoint.summary),
                responseTemplate: _this.generateResponseTemplate(endpoint),
                nextSteps: []
            });
        });
        return {
            id: "workflow_".concat(Date.now()),
            name: this.generateWorkflowName(goal),
            description: goal,
            goal: goal,
            steps: steps,
            triggers: this.generateTriggers(goal),
            responses: this.generateResponses(goal)
        };
    };
    AgentPlanner.prototype.generateSystemPrompt = function (workflow) {
        return "You are an AI assistant specialized in ".concat(this.api.name, " operations. Your goal is to help users ").concat(workflow.goal, ".\n\nCAPABILITIES:\n").concat(this.api.capabilities.map(function (cap) { return "- ".concat(cap); }).join('\n'), "\n\nWORKFLOW:\n").concat(workflow.steps.map(function (step) { return "".concat(step.id, ": ").concat(step.description); }).join('\n'), "\n\nINSTRUCTIONS:\n1. Always be helpful and professional\n2. Ask for clarification when needed\n3. Use the provided functions to interact with the ").concat(this.api.name, " API\n4. Format responses in a user-friendly way\n5. Handle errors gracefully and suggest alternatives\n6. Confirm actions before executing them\n\nRESPONSE STYLE:\n- Be conversational and friendly\n- Explain what you're doing and why\n- Provide clear next steps\n- Use examples when helpful\n\nRemember: You can only perform actions related to ").concat(this.api.name, ". If users ask about other services, politely redirect them to ").concat(this.api.name, "-related tasks.");
    };
    AgentPlanner.prototype.generateFunctionDefinitions = function () {
        var _this = this;
        return this.findRelevantEndpoints('').map(function (endpoint) {
            var parameters = {
                type: 'object',
                properties: {},
                required: []
            };
            endpoint.parameters.forEach(function (param) {
                parameters.properties[param.name] = {
                    type: param.type,
                    description: param.description
                };
                if (param.example) {
                    parameters.properties[param.name].example = param.example.toString();
                }
                if (param.required) {
                    parameters.required.push(param.name);
                }
            });
            return {
                name: _this.generateFunctionName(endpoint),
                description: "".concat(endpoint.summary, ": ").concat(endpoint.description),
                parameters: parameters
            };
        });
    };
    AgentPlanner.prototype.generateConversationFlow = function (workflow) {
        var _this = this;
        var nodes = [];
        // Greeting node
        nodes.push({
            id: 'greeting',
            type: 'greeting',
            message: workflow.responses.greeting || "Hello! I can help you with ".concat(this.api.name, " operations. ").concat(workflow.goal),
            triggers: ['start', 'hello', 'hi'],
            nextNodes: ['question']
        });
        // Question node
        nodes.push({
            id: 'question',
            type: 'question',
            message: 'What would you like me to help you with?',
            triggers: [],
            nextNodes: ['action']
        });
        // Action nodes for each endpoint
        workflow.steps
            .filter(function (step) { return step.type === 'api_call'; })
            .forEach(function (step) {
            nodes.push({
                id: step.id,
                type: 'action',
                message: "I'll ".concat(step.title.toLowerCase(), " for you."),
                triggers: _this.generateTriggers(step.title),
                actions: [step.id],
                nextNodes: ['response']
            });
        });
        // Response node
        nodes.push({
            id: 'response',
            type: 'response',
            message: 'Here are the results:',
            triggers: [],
            nextNodes: ['question']
        });
        // Error node
        nodes.push({
            id: 'error',
            type: 'error',
            message: 'I encountered an error. Let me try to help you in a different way.',
            triggers: [],
            nextNodes: ['question']
        });
        return nodes;
    };
    AgentPlanner.prototype.generateWorkflowName = function (goal) {
        var words = goal.split(' ').slice(0, 4);
        return words.map(function (word) { return word.charAt(0).toUpperCase() + word.slice(1); }).join(' ') + ' Agent';
    };
    AgentPlanner.prototype.generateTriggers = function (text) {
        var triggers = [];
        var words = text.toLowerCase().split(' ');
        // Add individual words as triggers
        words.forEach(function (word) {
            if (word.length > 3) {
                triggers.push(word);
            }
        });
        // Add common variations
        if (text.toLowerCase().includes('payment')) {
            triggers.push('pay', 'charge', 'billing', 'invoice');
        }
        if (text.toLowerCase().includes('customer')) {
            triggers.push('client', 'user', 'account');
        }
        if (text.toLowerCase().includes('order')) {
            triggers.push('purchase', 'buy', 'transaction');
        }
        return __spreadArray([], new Set(triggers), true);
    };
    AgentPlanner.prototype.generateGreeting = function (goal) {
        return "Hello! I'm your ".concat(this.api.name, " assistant. I can help you ").concat(goal, ". What would you like me to help you with today?");
    };
    AgentPlanner.prototype.generateParameterMapping = function (endpoint) {
        var mapping = {};
        endpoint.parameters.forEach(function (param) {
            if (param.example) {
                mapping[param.name] = param.example;
            }
            else {
                // Generate reasonable defaults based on type
                switch (param.type) {
                    case 'string':
                        mapping[param.name] = "{user_input_".concat(param.name, "}");
                        break;
                    case 'integer':
                    case 'number':
                        mapping[param.name] = param.name.includes('limit') ? 10 : 1;
                        break;
                    case 'boolean':
                        mapping[param.name] = true;
                        break;
                    default:
                        mapping[param.name] = "{".concat(param.name, "}");
                }
            }
        });
        return mapping;
    };
    AgentPlanner.prototype.generateResponseTemplate = function (endpoint) {
        if (endpoint.method === 'GET') {
            return "I found the ".concat(endpoint.summary.toLowerCase(), " information. Here's what I retrieved: {response_data}");
        }
        else if (endpoint.method === 'POST') {
            return "Successfully created ".concat(endpoint.summary.toLowerCase(), ". Here are the details: {response_data}");
        }
        else if (endpoint.method === 'PUT' || endpoint.method === 'PATCH') {
            return "Successfully updated ".concat(endpoint.summary.toLowerCase(), ". Here are the updated details: {response_data}");
        }
        else if (endpoint.method === 'DELETE') {
            return "Successfully deleted ".concat(endpoint.summary.toLowerCase(), ".");
        }
        return "Operation completed successfully. Result: {response_data}";
    };
    AgentPlanner.prototype.generateResponses = function (goal) {
        return {
            greeting: "Hello! I'm your ".concat(this.api.name, " assistant. I can help you ").concat(goal, "."),
            help: "I can help you with: ".concat(this.api.capabilities.map(function (cap) { return cap.toLowerCase(); }).join(', '), "."),
            error: "I encountered an error while processing your request. Please try again or rephrase your question.",
            success: "Great! I've successfully completed your request.",
            clarification: "I need a bit more information to help you. Could you please provide more details?"
        };
    };
    AgentPlanner.prototype.generateFunctionName = function (endpoint) {
        var path = endpoint.path.replace(/[{}]/g, '').replace(/\//g, '_');
        var method = endpoint.method.toLowerCase();
        return "".concat(method).concat(path).replace(/[^a-zA-Z0-9_]/g, '_').replace(/_+/g, '_');
    };
    return AgentPlanner;
}());
exports.AgentPlanner = AgentPlanner;
