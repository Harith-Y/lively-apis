"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.AIIntegration = void 0;
exports.executeAgentFunctionCalls = executeAgentFunctionCalls;
// Function registry for dynamic agent execution
var functionRegistry = {
    // Example Shopify inventory function
    getLowestStockItems: function (args, context, api, credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, ai, fakeCall, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = api.endpoints.find(function (e) { return e.summary.toLowerCase().includes('inventory') && e.method === 'GET'; }) || api.endpoints[0];
                        if (!endpoint)
                            throw new Error('No inventory endpoint found');
                        ai = new AIIntegration();
                        fakeCall = { name: 'getLowestStockItems', parameters: args };
                        return [4 /*yield*/, ai.executeFunctionCall(fakeCall, api, credentials)];
                    case 1:
                        result = _a.sent();
                        // Optionally process/sort/filter result here
                        return [2 /*return*/, result.result];
                }
            });
        });
    },
    // Example email function (replace with real email integration)
    sendEmail: function (args, context, api, credentials) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // args should include { to, subject, body }
                // For demo: just log and return
                console.log('Sending email:', args);
                return [2 /*return*/, __assign({ status: 'sent' }, args)];
            });
        });
    }
};
// Generic dynamic agent plan executor
function executeAgentFunctionCalls(functionCalls, api, credentials) {
    return __awaiter(this, void 0, void 0, function () {
        var context, results, _i, functionCalls_1, call, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    context = {};
                    results = [];
                    _i = 0, functionCalls_1 = functionCalls;
                    _a.label = 1;
                case 1:
                    if (!(_i < functionCalls_1.length)) return [3 /*break*/, 8];
                    call = functionCalls_1[_i];
                    if (!functionRegistry[call.name]) return [3 /*break*/, 6];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, functionRegistry[call.name](call.parameters, context, api, credentials)];
                case 3:
                    result = _a.sent();
                    results.push(__assign(__assign({}, call), { result: result }));
                    context[call.name] = result;
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    results.push(__assign(__assign({}, call), { error: error_1 instanceof Error ? error_1.message : String(error_1) }));
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 7];
                case 6:
                    results.push(__assign(__assign({}, call), { error: "Unknown function: ".concat(call.name) }));
                    _a.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/, results];
            }
        });
    });
}
var AIIntegration = /** @class */ (function () {
    function AIIntegration(provider, apiKey) {
        if (provider === void 0) { provider = 'openai'; }
        this.provider = provider;
        if (provider === 'openrouter') {
            this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
            this.baseUrl = 'https://openrouter.ai/api/v1';
        }
        else if (provider === 'openai') {
            this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
            this.baseUrl = 'https://api.openai.com/v1';
        }
        else {
            this.apiKey = apiKey || '';
            this.baseUrl = 'https://api.anthropic.com/v1';
        }
    }
    AIIntegration.prototype.executeAgent = function (plan, userMessage, api, apiCredentials) {
        return __awaiter(this, void 0, void 0, function () {
            var execution, aiResponse, _i, _a, functionCall, result, followUpResponse, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        execution = {
                            id: "exec_".concat(Date.now()),
                            userMessage: userMessage,
                            agentResponse: '',
                            functionCalls: [],
                            timestamp: new Date(),
                            success: false
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 9, , 10]);
                        return [4 /*yield*/, this.callAI(plan.systemPrompt, userMessage, plan.functionDefinitions)];
                    case 2:
                        aiResponse = _b.sent();
                        execution.agentResponse = aiResponse.content;
                        if (!aiResponse.functionCalls) return [3 /*break*/, 8];
                        _i = 0, _a = aiResponse.functionCalls;
                        _b.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        functionCall = _a[_i];
                        return [4 /*yield*/, this.executeFunctionCall(functionCall, api, apiCredentials)];
                    case 4:
                        result = _b.sent();
                        execution.functionCalls.push(result);
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        if (!(execution.functionCalls.length > 0)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.getFollowUpResponse(plan.systemPrompt, userMessage, execution.functionCalls)];
                    case 7:
                        followUpResponse = _b.sent();
                        execution.agentResponse = followUpResponse.content;
                        _b.label = 8;
                    case 8:
                        execution.success = true;
                        return [3 /*break*/, 10];
                    case 9:
                        error_2 = _b.sent();
                        execution.error = error_2 instanceof Error ? error_2.message : 'Unknown error';
                        execution.agentResponse = this.generateErrorResponse(execution.error);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/, execution];
                }
            });
        });
    };
    AIIntegration.prototype.callAI = function (systemPrompt, userMessage, functions) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.provider === 'openai') {
                    return [2 /*return*/, this.callOpenAI(systemPrompt, userMessage, functions)];
                }
                else if (this.provider === 'openrouter') {
                    return [2 /*return*/, this.callOpenRouter(systemPrompt, userMessage, functions)];
                }
                else {
                    return [2 /*return*/, this.callClaude(systemPrompt, userMessage, functions)];
                }
                return [2 /*return*/];
            });
        });
    };
    AIIntegration.prototype.callOpenAI = function (systemPrompt, userMessage, functions) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, message, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.baseUrl, "/chat/completions"), {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(this.apiKey),
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                model: 'gpt-4',
                                messages: [
                                    { role: 'system', content: systemPrompt },
                                    { role: 'user', content: userMessage }
                                ],
                                functions: functions.length > 0 ? functions : undefined,
                                function_call: functions.length > 0 ? 'auto' : undefined,
                                temperature: 0.7,
                                max_tokens: 1000
                            })
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("OpenAI API error: ".concat(response.statusText));
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        message = data.choices[0].message;
                        result = {
                            content: message.content || ''
                        };
                        if (message.function_call) {
                            result.functionCalls = [{
                                    name: message.function_call.name,
                                    parameters: JSON.parse(message.function_call.arguments || '{}')
                                }];
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    AIIntegration.prototype.callOpenRouter = function (systemPrompt, userMessage, functions) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, message, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.baseUrl, "/chat/completions"), {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(this.apiKey),
                                'Content-Type': 'application/json',
                                'HTTP-Referer': 'https://your-app-domain.com', // Optional: set your app domain
                                'X-Title': 'LivelyAPI', // Optional: set your app name
                            },
                            body: JSON.stringify({
                                model: 'openrouter/auto',
                                messages: [
                                    { role: 'system', content: systemPrompt },
                                    { role: 'user', content: userMessage }
                                ],
                                functions: functions.length > 0 ? functions : undefined,
                                function_call: functions.length > 0 ? 'auto' : undefined,
                                temperature: 0.7,
                                max_tokens: 1000
                            })
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("OpenRouter API error: ".concat(response.statusText));
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        message = data.choices[0].message;
                        result = {
                            content: message.content || ''
                        };
                        if (message.function_call) {
                            result.functionCalls = [{
                                    name: message.function_call.name,
                                    parameters: JSON.parse(message.function_call.arguments || '{}')
                                }];
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    AIIntegration.prototype.callClaude = function (_systemPrompt, _userMessage, _functions) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        content: "I'm a Claude-powered agent ready to help with your API operations. However, Claude integration is not fully implemented in this demo."
                    }];
            });
        });
    };
    AIIntegration.prototype.executeFunctionCall = function (functionCall, api, credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, apiRequest, response, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        endpoint = this.findEndpointForFunction(functionCall.name, api);
                        if (!endpoint) {
                            throw new Error("Unknown function: ".concat(functionCall.name));
                        }
                        apiRequest = this.buildAPIRequest(endpoint, functionCall.parameters, api, credentials);
                        return [4 /*yield*/, fetch(apiRequest.url, apiRequest.options)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("API call failed: ".concat(response.status, " ").concat(response.statusText));
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, functionCall), { result: result })];
                    case 3:
                        error_3 = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, functionCall), { error: error_3 instanceof Error ? error_3.message : 'Unknown error' })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AIIntegration.prototype.findEndpointForFunction = function (functionName, api) {
        var _this = this;
        return api.endpoints.find(function (endpoint) {
            var expectedName = _this.generateFunctionName(endpoint);
            return expectedName === functionName;
        }) || null;
    };
    AIIntegration.prototype.generateFunctionName = function (endpoint) {
        var path = endpoint.path.replace(/[{}]/g, '').replace(/\//g, '_');
        var method = endpoint.method.toLowerCase();
        return "".concat(method).concat(path).replace(/[^a-zA-Z0-9_]/g, '_').replace(/_+/g, '_');
    };
    AIIntegration.prototype.buildAPIRequest = function (endpoint, parameters, api, credentials) {
        var url = api.baseUrl + endpoint.path;
        var headers = {
            'Content-Type': 'application/json'
        };
        if (api.authentication.type === 'bearer') {
            headers['Authorization'] = "Bearer ".concat(credentials.apiKey || credentials.token);
        }
        else if (api.authentication.type === 'apiKey') {
            if (api.authentication.location === 'header') {
                headers[api.authentication.name || 'X-API-Key'] = credentials.apiKey || '';
            }
        }
        endpoint.parameters
            .filter(function (p) { return p.location === 'path'; })
            .forEach(function (param) {
            if (parameters[param.name]) {
                url = url.replace("{".concat(param.name, "}"), String(parameters[param.name]));
            }
        });
        var queryParams = new URLSearchParams();
        endpoint.parameters
            .filter(function (p) { return p.location === 'query'; })
            .forEach(function (param) {
            if (parameters[param.name] !== undefined) {
                queryParams.append(param.name, String(parameters[param.name]));
            }
        });
        if (queryParams.toString()) {
            url += '?' + queryParams.toString();
        }
        var body;
        var bodyParams = endpoint.parameters.filter(function (p) { return p.location === 'body'; });
        if (bodyParams.length > 0 && endpoint.method !== 'GET') {
            var bodyData_1 = {};
            bodyParams.forEach(function (param) {
                if (parameters[param.name] !== undefined) {
                    bodyData_1[param.name] = parameters[param.name];
                }
            });
            body = JSON.stringify(bodyData_1);
        }
        return {
            url: url,
            options: {
                method: endpoint.method,
                headers: headers,
                body: body
            }
        };
    };
    AIIntegration.prototype.getFollowUpResponse = function (systemPrompt, originalMessage, functionResults) {
        return __awaiter(this, void 0, void 0, function () {
            var resultsContext, followUpMessage;
            return __generator(this, function (_a) {
                resultsContext = functionResults.map(function (fc) {
                    return "Function ".concat(fc.name, " ").concat(fc.error ? 'failed' : 'succeeded', ": ").concat(fc.error || JSON.stringify(fc.result));
                }).join('\n');
                followUpMessage = "Based on the function call results:\n".concat(resultsContext, "\n\nPlease provide a helpful response to the user's original request: \"").concat(originalMessage, "\"");
                return [2 /*return*/, this.callAI(systemPrompt, followUpMessage, [])];
            });
        });
    };
    AIIntegration.prototype.generateErrorResponse = function (error) {
        return "I apologize, but I encountered an error while processing your request: ".concat(error, ". Please try again or rephrase your question.");
    };
    AIIntegration.prototype.testAgent = function (plan, testMessage) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { agentResponse: "This is a test response to: \"".concat(testMessage, "\". In a real implementation, I would process this using the configured AI model and execute any necessary API calls.") }];
            });
        });
    };
    return AIIntegration;
}());
exports.AIIntegration = AIIntegration;
