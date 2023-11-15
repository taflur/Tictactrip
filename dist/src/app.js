"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = require("./middleware/auth");
var justifyText_1 = require("./justifyText");
var ratelimit_1 = require("./middleware/ratelimit");
var body_parser_1 = __importDefault(require("body-parser"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var swagger_output_json_1 = __importDefault(require("../swagger_output.json"));
var app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default));
/**
 * @openapi
 * /api/token:
 *   post:
 *     tags:
 *       - Get Token
 *     summary: Getting a new token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Email is required or Invalid email format
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */
// route to obtain token
app.post('/api/token', function (req, res) {
    var email = req.body.email;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    var tokenOrError = (0, auth_1.generateToken)(email);
    if (typeof tokenOrError === 'string') {
        res.status(201).json({ token: tokenOrError });
    }
    else {
        res.status(400).json({ error: 'Invalid email format' });
    }
});
/**
 * @openapi
 * /api/justify:
 *   post:
 *     tags:
 *       - Text Justification
 *     summary: Justify text
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       402:
 *         description: Payment Required
 *       404:
 *         description: Not Found
 *       401:
 *         description: No Authorization header or Token has expired
 *       403:
 *         description: Invalid token
 *       500:
 *         description: Server Error
 */
// route to justify text
app.post('/api/justify', auth_1.authenticateToken, function (req, res) {
    var text = req.body.text;
    var token = req.headers.authorization;
    if (typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: 'Text is required in the request body.' });
    }
    var wordLimiterMiddleware = (0, ratelimit_1.wordLimiter)(token, text);
    wordLimiterMiddleware(req, res, function () {
        var justifiedText = (0, justifyText_1.justify)(text);
        res.setHeader('Content-Type', 'text/plain');
        res.status(201).send(justifiedText);
    });
});
exports.default = app;
