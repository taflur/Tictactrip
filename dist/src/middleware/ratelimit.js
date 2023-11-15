"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordLimiter = void 0;
var WORD_LIMIT_PER_DAY = 80000;
var tokenWordCounts = [];
var wordLimiter = function (token, text) { return function (req, res, next) {
    var existingTokenCount = tokenWordCounts.find(function (item) { return item.token === token; });
    // Check if the word limit for the day is exceeded
    var requestWordsCount = countWords(text);
    var totalWordCount = existingTokenCount ? existingTokenCount.wordCount + requestWordsCount : requestWordsCount;
    if (totalWordCount > WORD_LIMIT_PER_DAY) {
        res.status(402);
        res.json({ message: 'Payment Required - Word Limit Exceeded' });
        return res;
    }
    var index = tokenWordCounts.findIndex(function (item) { return item.token === token; });
    if (index !== -1) {
        tokenWordCounts[index].wordCount = totalWordCount;
    }
    else {
        tokenWordCounts.push({ token: token, wordCount: totalWordCount });
    }
    next();
}; };
exports.wordLimiter = wordLimiter;
function countWords(text) {
    return text.split(/\s+/).filter(function (word) { return word !== ''; }).length;
}
