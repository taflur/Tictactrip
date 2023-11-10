import express, { Express, Request, Response } from 'express';
import { generateToken, authenticateToken } from './middleware/auth.js';
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

// app listening
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});