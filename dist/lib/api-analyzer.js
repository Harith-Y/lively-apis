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
exports.APIAnalyzer = void 0;
// Predefined API configurations for popular services
var POPULAR_APIS = {
    stripe: {
        name: 'Stripe',
        baseUrl: 'https://api.stripe.com/v1',
        description: 'Payment processing and subscription management',
        authentication: { type: 'bearer' },
        endpoints: [
            {
                path: '/customers',
                method: 'GET',
                summary: 'List customers',
                description: 'Returns a list of your customers',
                parameters: [
                    { name: 'limit', type: 'integer', required: false, description: 'Number of customers to return', location: 'query', example: 10 },
                    { name: 'email', type: 'string', required: false, description: 'Filter by customer email', location: 'query' }
                ],
                responses: [
                    { statusCode: 200, description: 'List of customers', example: { data: [], has_more: false } }
                ],
                tags: ['customers']
            },
            {
                path: '/customers',
                method: 'POST',
                summary: 'Create customer',
                description: 'Creates a new customer object',
                parameters: [
                    { name: 'email', type: 'string', required: false, description: 'Customer email', location: 'body' },
                    { name: 'name', type: 'string', required: false, description: 'Customer name', location: 'body' },
                    { name: 'phone', type: 'string', required: false, description: 'Customer phone', location: 'body' }
                ],
                responses: [
                    { statusCode: 200, description: 'Customer created', example: { id: 'cus_123', email: 'customer@example.com' } }
                ],
                tags: ['customers']
            },
            {
                path: '/payment_intents',
                method: 'POST',
                summary: 'Create payment intent',
                description: 'Creates a PaymentIntent object',
                parameters: [
                    { name: 'amount', type: 'integer', required: true, description: 'Amount in cents', location: 'body', example: 2000 },
                    { name: 'currency', type: 'string', required: true, description: 'Currency code', location: 'body', example: 'usd' },
                    { name: 'customer', type: 'string', required: false, description: 'Customer ID', location: 'body' }
                ],
                responses: [
                    { statusCode: 200, description: 'Payment intent created', example: { id: 'pi_123', status: 'requires_payment_method' } }
                ],
                tags: ['payments']
            },
            {
                path: '/subscriptions',
                method: 'GET',
                summary: 'List subscriptions',
                description: 'Returns a list of your subscriptions',
                parameters: [
                    { name: 'customer', type: 'string', required: false, description: 'Filter by customer ID', location: 'query' },
                    { name: 'status', type: 'string', required: false, description: 'Filter by status', location: 'query' }
                ],
                responses: [
                    { statusCode: 200, description: 'List of subscriptions', example: { data: [], has_more: false } }
                ],
                tags: ['subscriptions']
            }
        ],
        capabilities: [
            'Process payments',
            'Manage customers',
            'Handle subscriptions',
            'Create invoices',
            'Manage payment methods'
        ]
    },
    shopify: {
        name: 'Shopify',
        baseUrl: 'https://{shop}.myshopify.com/admin/api/2023-10',
        description: 'E-commerce platform for online stores',
        authentication: { type: 'apiKey', location: 'header', name: 'X-Shopify-Access-Token' },
        endpoints: [
            {
                path: '/products.json',
                method: 'GET',
                summary: 'List products',
                description: 'Retrieve a list of products',
                parameters: [
                    { name: 'limit', type: 'integer', required: false, description: 'Number of products to return', location: 'query', example: 50 },
                    { name: 'status', type: 'string', required: false, description: 'Filter by status', location: 'query' }
                ],
                responses: [
                    { statusCode: 200, description: 'List of products', example: { products: [] } }
                ],
                tags: ['products']
            },
            {
                path: '/orders.json',
                method: 'GET',
                summary: 'List orders',
                description: 'Retrieve a list of orders',
                parameters: [
                    { name: 'status', type: 'string', required: false, description: 'Filter by order status', location: 'query' },
                    { name: 'limit', type: 'integer', required: false, description: 'Number of orders to return', location: 'query', example: 50 }
                ],
                responses: [
                    { statusCode: 200, description: 'List of orders', example: { orders: [] } }
                ],
                tags: ['orders']
            },
            {
                path: '/customers.json',
                method: 'GET',
                summary: 'List customers',
                description: 'Retrieve a list of customers',
                parameters: [
                    { name: 'limit', type: 'integer', required: false, description: 'Number of customers to return', location: 'query', example: 50 }
                ],
                responses: [
                    { statusCode: 200, description: 'List of customers', example: { customers: [] } }
                ],
                tags: ['customers']
            },
            {
                path: '/inventory_levels.json',
                method: 'GET',
                summary: 'Get inventory levels',
                description: 'Retrieve inventory levels for products',
                parameters: [
                    { name: 'inventory_item_ids', type: 'string', required: false, description: 'Comma-separated inventory item IDs', location: 'query' }
                ],
                responses: [
                    { statusCode: 200, description: 'Inventory levels', example: { inventory_levels: [] } }
                ],
                tags: ['inventory']
            }
        ],
        capabilities: [
            'Manage products',
            'Process orders',
            'Handle customers',
            'Track inventory',
            'Manage collections'
        ]
    },
    slack: {
        name: 'Slack',
        baseUrl: 'https://slack.com/api',
        description: 'Team communication and collaboration platform',
        authentication: { type: 'bearer' },
        endpoints: [
            {
                path: '/chat.postMessage',
                method: 'POST',
                summary: 'Send message',
                description: 'Sends a message to a channel',
                parameters: [
                    { name: 'channel', type: 'string', required: true, description: 'Channel ID or name', location: 'body', example: '#general' },
                    { name: 'text', type: 'string', required: true, description: 'Message text', location: 'body', example: 'Hello, world!' },
                    { name: 'username', type: 'string', required: false, description: 'Bot username', location: 'body' }
                ],
                responses: [
                    { statusCode: 200, description: 'Message sent', example: { ok: true, ts: '1234567890.123456' } }
                ],
                tags: ['messaging']
            },
            {
                path: '/users.list',
                method: 'GET',
                summary: 'List users',
                description: 'Lists all users in a Slack team',
                parameters: [
                    { name: 'limit', type: 'integer', required: false, description: 'Number of users to return', location: 'query', example: 100 }
                ],
                responses: [
                    { statusCode: 200, description: 'List of users', example: { ok: true, members: [] } }
                ],
                tags: ['users']
            },
            {
                path: '/channels.list',
                method: 'GET',
                summary: 'List channels',
                description: 'Lists all channels in a Slack team',
                parameters: [
                    { name: 'exclude_archived', type: 'boolean', required: false, description: 'Exclude archived channels', location: 'query', example: true }
                ],
                responses: [
                    { statusCode: 200, description: 'List of channels', example: { ok: true, channels: [] } }
                ],
                tags: ['channels']
            },
            {
                path: '/files.upload',
                method: 'POST',
                summary: 'Upload file',
                description: 'Uploads or creates a file',
                parameters: [
                    { name: 'channels', type: 'string', required: false, description: 'Comma-separated list of channel names or IDs', location: 'body' },
                    { name: 'content', type: 'string', required: false, description: 'File contents', location: 'body' },
                    { name: 'filename', type: 'string', required: false, description: 'Filename of file', location: 'body' }
                ],
                responses: [
                    { statusCode: 200, description: 'File uploaded', example: { ok: true, file: { id: 'F1234567890' } } }
                ],
                tags: ['files']
            }
        ],
        capabilities: [
            'Send messages',
            'Manage channels',
            'Handle users',
            'Upload files',
            'Create workflows'
        ]
    }
};
var APIAnalyzer = /** @class */ (function () {
    function APIAnalyzer() {
    }
    APIAnalyzer.prototype.analyzeAPI = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var popularAPI;
            return __generator(this, function (_a) {
                popularAPI = this.detectPopularAPI(input);
                if (popularAPI) {
                    return [2 /*return*/, popularAPI];
                }
                // Try to parse as OpenAPI spec
                if (this.isOpenAPISpec(input)) {
                    return [2 /*return*/, this.parseOpenAPISpec(input)];
                }
                // Try to analyze as URL
                if (this.isURL(input)) {
                    return [2 /*return*/, this.analyzeAPIFromURL(input)];
                }
                throw new Error('Unable to analyze API. Please provide a valid URL or OpenAPI specification.');
            });
        });
    };
    APIAnalyzer.prototype.detectPopularAPI = function (input) {
        var normalizedInput = input.toLowerCase();
        if (normalizedInput.includes('stripe') || normalizedInput.includes('api.stripe.com')) {
            return POPULAR_APIS.stripe;
        }
        if (normalizedInput.includes('shopify') || normalizedInput.includes('myshopify.com')) {
            return POPULAR_APIS.shopify;
        }
        if (normalizedInput.includes('slack') || normalizedInput.includes('slack.com/api')) {
            return POPULAR_APIS.slack;
        }
        return null;
    };
    APIAnalyzer.prototype.isOpenAPISpec = function (input) {
        try {
            var parsed = JSON.parse(input);
            return parsed.openapi || parsed.swagger;
        }
        catch (error) {
            console.error('Error parsing OpenAPI spec:', error);
            return false;
        }
    };
    APIAnalyzer.prototype.isURL = function (input) {
        try {
            new URL(input);
            return true;
        }
        catch (_a) {
            return false;
        }
    };
    APIAnalyzer.prototype.parseOpenAPISpec = function (spec) {
        var _a, _b, _c, _d;
        var parsed = JSON.parse(spec);
        var endpoints = [];
        // Parse paths
        Object.entries(parsed.paths || {}).forEach(function (_a) {
            var path = _a[0], pathObj = _a[1];
            Object.entries(pathObj).forEach(function (_a) {
                var _b;
                var method = _a[0], methodObj = _a[1];
                if (['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
                    var parameters_1 = [];
                    // Parse parameters
                    if (methodObj.parameters) {
                        methodObj.parameters.forEach(function (param) {
                            parameters_1.push({
                                name: param.name,
                                type: param.type || 'string',
                                required: param.required || false,
                                description: param.description || '',
                                location: param.in,
                                example: param.example
                            });
                        });
                    }
                    // Parse request body
                    if ((_b = methodObj.requestBody) === null || _b === void 0 ? void 0 : _b.content) {
                        var content = methodObj.requestBody.content;
                        var jsonContent = content['application/json'];
                        if (jsonContent === null || jsonContent === void 0 ? void 0 : jsonContent.schema) {
                            var requiredProperties_1 = ('required' in jsonContent.schema && Array.isArray(jsonContent.schema.required)) ? jsonContent.schema.required : [];
                            Object.entries(jsonContent.schema.properties || {}).forEach(function (_a) {
                                var name = _a[0], prop = _a[1];
                                parameters_1.push({
                                    name: name,
                                    type: prop.type || 'string',
                                    required: requiredProperties_1.includes(name),
                                    description: prop.description || '',
                                    location: 'body',
                                    example: prop.example
                                });
                            });
                        }
                    }
                    // Parse responses
                    var responses_1 = [];
                    Object.entries(methodObj.responses || {}).forEach(function (_a) {
                        var _b, _c;
                        var code = _a[0], response = _a[1];
                        responses_1.push({
                            statusCode: parseInt(code),
                            description: response.description || '',
                            example: (_c = (_b = response.content) === null || _b === void 0 ? void 0 : _b['application/json']) === null || _c === void 0 ? void 0 : _c.example
                        });
                    });
                    endpoints.push({
                        path: path,
                        method: method.toUpperCase(),
                        summary: methodObj.summary || '',
                        description: methodObj.description || '',
                        parameters: parameters_1,
                        responses: responses_1,
                        tags: methodObj.tags || []
                    });
                }
            });
        });
        return {
            name: ((_a = parsed.info) === null || _a === void 0 ? void 0 : _a.title) || 'Unknown API',
            baseUrl: ((_c = (_b = parsed.servers) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.url) || '',
            description: ((_d = parsed.info) === null || _d === void 0 ? void 0 : _d.description) || '',
            endpoints: endpoints,
            authentication: this.parseAuthentication(parsed),
            capabilities: this.generateCapabilities(endpoints)
        };
    };
    APIAnalyzer.prototype.analyzeAPIFromURL = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // For demo purposes, return a basic structure
                // In a real implementation, this would make HTTP requests to discover endpoints
                return [2 /*return*/, {
                        name: 'Custom API',
                        baseUrl: url,
                        description: 'Custom API endpoint',
                        endpoints: [
                            {
                                path: '/',
                                method: 'GET',
                                summary: 'Root endpoint',
                                description: 'Main API endpoint',
                                parameters: [],
                                responses: [{ statusCode: 200, description: 'Success' }],
                                tags: ['general']
                            }
                        ],
                        authentication: { type: 'apiKey' },
                        capabilities: ['General API operations']
                    }];
            });
        });
    };
    APIAnalyzer.prototype.parseAuthentication = function (spec) {
        var _a;
        var securitySchemes = (_a = spec.components) === null || _a === void 0 ? void 0 : _a.securitySchemes;
        if (!securitySchemes) {
            return { type: 'apiKey' };
        }
        var firstScheme = Object.values(securitySchemes)[0];
        if ((firstScheme === null || firstScheme === void 0 ? void 0 : firstScheme.type) === 'http' && (firstScheme === null || firstScheme === void 0 ? void 0 : firstScheme.scheme) === 'bearer') {
            return { type: 'bearer' };
        }
        if ((firstScheme === null || firstScheme === void 0 ? void 0 : firstScheme.type) === 'apiKey') {
            return {
                type: 'apiKey',
                location: firstScheme.in,
                name: firstScheme.name
            };
        }
        return { type: 'apiKey' };
    };
    APIAnalyzer.prototype.generateCapabilities = function (endpoints) {
        var capabilities = new Set();
        endpoints.forEach(function (endpoint) {
            endpoint.tags.forEach(function (tag) {
                capabilities.add("Manage ".concat(tag));
            });
            if (endpoint.method === 'GET') {
                capabilities.add('Retrieve data');
            }
            if (endpoint.method === 'POST') {
                capabilities.add('Create resources');
            }
            if (endpoint.method === 'PUT' || endpoint.method === 'PATCH') {
                capabilities.add('Update resources');
            }
            if (endpoint.method === 'DELETE') {
                capabilities.add('Delete resources');
            }
        });
        return Array.from(capabilities);
    };
    APIAnalyzer.prototype.generateNaturalLanguageDescription = function (api) {
        var name = api.name, description = api.description, capabilities = api.capabilities, endpoints = api.endpoints;
        var desc = "".concat(name, " is ").concat(description, ". ");
        desc += "It provides ".concat(capabilities.length, " main capabilities: ").concat(capabilities.join(', '), ". ");
        desc += "The API has ".concat(endpoints.length, " endpoints available for integration. ");
        var methods = endpoints.reduce(function (acc, endpoint) {
            acc[endpoint.method] = (acc[endpoint.method] || 0) + 1;
            return acc;
        }, {});
        desc += "Available operations include: ";
        desc += Object.entries(methods).map(function (_a) {
            var method = _a[0], count = _a[1];
            return "".concat(count, " ").concat(method, " endpoint").concat(count > 1 ? 's' : '');
        }).join(', ');
        desc += '.';
        return desc;
    };
    return APIAnalyzer;
}());
exports.APIAnalyzer = APIAnalyzer;
