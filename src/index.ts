import express, { Express, Request, Response } from 'express';
import { generateToken, authenticateToken } from './middleware/auth.js';
import { justify } from './justifyText.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// route to obtain token
app.post('/api/token', (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const token = generateToken(email);
    res.json({ token });
});

// route to justify text
app.post('/api/justify',authenticateToken, (req: Request, res: Response) => {
    const { text } = req.body;

    if (typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: 'Text is required in the request body.' });
    }

    const justifiedText = justify(text);

    res.send(justifiedText);

});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});