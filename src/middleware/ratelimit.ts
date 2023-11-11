import express from 'express';

const WORD_LIMIT_PER_DAY = 80000;

interface TokenWordCount {
    token: string;
    wordCount: number;
}
const tokenWordCounts: TokenWordCount[] = [];

export const wordLimiter = (token: string, text: string) => (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) => {
    const existingTokenCount = tokenWordCounts.find(item => item.token === token);

    // Check if the word limit for the day is exceeded
    const requestWordsCount = countWords(text);
    const totalWordCount = existingTokenCount ? existingTokenCount.wordCount + requestWordsCount : requestWordsCount;
    if (totalWordCount > WORD_LIMIT_PER_DAY) {
        return res.status(402).send('Payment Required - Word Limit Exceeded');
    }

    const index = tokenWordCounts.findIndex(item => item.token === token);
    if (index !== -1) {
        tokenWordCounts[index].wordCount = totalWordCount;
    } else {
        tokenWordCounts.push({ token, wordCount: totalWordCount });
    }


    next();
}

function countWords(text: string): number {
    return text.split(/\s+/).filter(word => word !== '').length;
}
