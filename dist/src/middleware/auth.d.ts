import express from 'express';
export declare function generateToken(email: string): string;
export declare function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction): express.Response<any, Record<string, any>>;
