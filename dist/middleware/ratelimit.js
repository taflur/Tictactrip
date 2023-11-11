const WORD_LIMIT_PER_DAY = 800;
const tokenWordCounts = [];
export const wordLimiter = (token, text) => (req, res, next) => {
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
    }
    else {
        tokenWordCounts.push({ token, wordCount: totalWordCount });
    }
    next();
};
function countWords(text) {
    return text.split(/\s+/).filter(word => word !== '').length;
}
//# sourceMappingURL=ratelimit.js.map