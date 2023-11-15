"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.justifyLine = exports.justify = void 0;
var LINE_LENGTH = 80;
function justify(text) {
    var lines = text.split('\n');
    var justifiedLines = lines.map(function (line) { return justifyLine(line); });
    return justifiedLines.join('\n');
}
exports.justify = justify;
function justifyLine(line) {
    var words = line.split(' ');
    var result = [];
    var currentList = [];
    var numOfLetters = 0;
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var word = words_1[_i];
        if (numOfLetters + word.length + currentList.length > LINE_LENGTH) {
            var size = Math.max(1, currentList.length - 1);
            for (var i = 0; i < LINE_LENGTH - numOfLetters; i++) {
                var index = i % size;
                currentList[index] += ' ';
            }
            result.push(currentList.join(''));
            currentList = [];
            numOfLetters = 0;
        }
        currentList.push(word);
        numOfLetters += word.length;
    }
    var lastLine = currentList.join(' ').padEnd(LINE_LENGTH);
    result.push(lastLine);
    return result.join('\n');
}
exports.justifyLine = justifyLine;
