import express from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const secretKey = process.env.SECRET_KEY || '';

export function generateToken(email: string): string | { error: string }  {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return { error: 'Invalid email format' };
    }
    return jwt.sign({ email }, secretKey, { expiresIn: '1d' });
}

export function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401);
        res.json({error: 'No Authorization header found in the request'});
        return res;
    }

    jwt.verify(token as string, secretKey, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                res.status(401);
                res.json({error: 'Token has expired'});
                return res;
            } else {
                res.status(403);
                res.json({error: 'Invalid token'});
                return res;
            }
        }

        req.body.email = (user as { email: string }).email;
        next();
    });
}
