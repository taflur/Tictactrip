import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const secretKey = process.env.SECRET_KEY || '';

export function generateToken(email: string): string {
    return jwt.sign({ email }, secretKey, { expiresIn: '1d' });
}

export function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({error: 'No Authorization header found in the request'});
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({error: 'Token has expired'});
                } else {
                    return res.status(403).json({error: 'Invalid token'});
                }
            }
        }

        req.body.email = (user as { email: string }).email;
        next();
    });
}
