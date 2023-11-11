import express from 'express';
import { generateToken, authenticateToken } from './middleware/auth.js';
import { justify } from './justifyText.js';
import { wordLimiter } from "./middleware/ratelimit.js";
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
// route to obtain token
app.post('/api/token', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    const token = generateToken(email);
    res.json({ token });
});
// route to justify text
app.post('/api/justify', authenticateToken, (req, res) => {
    const { text } = req.body;
    const token = req.header('Authorization');
    if (typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: 'Text is required in the request body.' });
    }
    const wordLimiterMiddleware = wordLimiter(token, text);
    wordLimiterMiddleware(req, res, () => {
        const justifiedText = justify(text);
        res.setHeader('Content-Type', 'text/plain');
        res.send(justifiedText);
    });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//# sourceMappingURL=index.js.map