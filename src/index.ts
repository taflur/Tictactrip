import express, { Request, Response } from 'express';
import { generateToken, authenticateToken } from './middleware/auth.js';
import { justify } from './justifyText.js';
import { wordLimiter } from "./middleware/ratelimit.js";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import swaggerUi from "swagger-ui-express";

import { createRequire } from "module"
const require = createRequire(import.meta.url);
const swaggerOutput = require("../swagger_output.json")

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

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
 *       201:
 *         description: Success
 *       400:
 *         description: Email is required or Invalid email format
 *       404:
 *         description: Not Found
 *       500:
 *         description: Server Error
 */

// route to obtain token
app.post('/api/token', (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const tokenOrError = generateToken(email);

    if (typeof tokenOrError === 'string') {
        res.status(201).json({ token: tokenOrError });
    } else {
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
 *       201:
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
app.post('/api/justify',authenticateToken , (req: Request, res: Response) => {
    const { text } = req.body;
    const token = req.header('Authorization');

    if (typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: 'Text is required in the request body.' });
    }

    const wordLimiterMiddleware = wordLimiter(token, text);

    wordLimiterMiddleware(req, res, () => {
        const justifiedText = justify(text);

        res.setHeader('Content-Type', 'text/plain');
        res.status(201).send(justifiedText);
    });

});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});