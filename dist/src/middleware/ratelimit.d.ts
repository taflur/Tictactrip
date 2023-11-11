import express from 'express';
export declare const wordLimiter: (token: string, text: string) => (req: express.Request, res: express.Response, next: express.NextFunction) => express.Response<any, Record<string, any>>;
