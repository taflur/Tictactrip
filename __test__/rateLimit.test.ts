import express from 'express';
import { wordLimiter } from '../src/middleware/ratelimit';

describe('wordLimiter middleware', () => {
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
            send: jest.fn() as any,
        } as express.Response;
        next = jest.fn() as express.NextFunction;
    });

    it('should allow requests within the word limit', () => {
        const middleware = wordLimiter('valid-token', 'This is a valid text with some words.');

        middleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should reject requests exceeding the word limit', () => {
        const middleware = wordLimiter('exceeding-token', 'This is a long text with too many words.'.repeat(100000));

        middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(402);
        expect(res.json).toHaveBeenCalledWith({message: 'Payment Required - Word Limit Exceeded'});
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle multiple requests with the same token', () => {
        const middleware = wordLimiter('token', 'This is a valid text.');

        middleware(req, res, next);
        expect(next).toHaveBeenCalled();

        middleware(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
