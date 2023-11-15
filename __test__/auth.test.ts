import express from 'express';
import { generateToken, authenticateToken } from '../src/middleware/auth';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn(),
}));

describe('generateToken', () => {
    it('should generate a token with the provided email', () => {
        const email = 'test@example.com';
        const expectedToken = 'mocked-token';

        (jwt.sign as jest.Mock).mockReturnValueOnce(expectedToken);

        const result = generateToken(email);

        expect(result).toBe(expectedToken);
        expect(jwt.sign).toHaveBeenCalledWith({ email }, expect.any(String), { expiresIn: '1d' });
    });
});

describe('authenticateToken', () => {
    let req: express.Request;
    let res: express.Response;
    let next: express.NextFunction;

    beforeEach(() => {
        req = {
            headers: {},
            body: {}
        } as express.Request;
        res = {
            status: jest.fn() as any,
            json: jest.fn() as any,
        } as express.Response;
        next = jest.fn() as express.NextFunction;
    });

    it('handles missing Authorization header', () => {
        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({error: 'No Authorization header found in the request'});
        expect(next).not.toHaveBeenCalled();
    });

    it('handles invalid token', () => {
        req.headers = { authorization: 'invalid-token' };

        (jwt.verify as jest.Mock).mockImplementationOnce((token, key, callback) => {
            callback({ name: 'SomeOtherError' }, null);
        });

        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
        expect(next).not.toHaveBeenCalled();
    });

    it('handles expired token', () => {
        req.headers = { authorization: 'expired-token' };

        (jwt.verify as jest.Mock).mockImplementationOnce((token, key, callback) => {
            callback({ name: 'TokenExpiredError' }, null);
        });

        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Token has expired' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should set req.body.email and call next for a valid token', () => {
        req.headers = { authorization: 'valid-token' };

        const userEmail = 'test@example.com';
        (jwt.verify as jest.Mock).mockImplementationOnce((token, key, callback) => {
            callback(null, { email: userEmail });
        });

        authenticateToken(req, res, next);

        expect(req.body.email).toBe(userEmail);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});
