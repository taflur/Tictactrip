const LINE_LENGTH = 80000;

export function justify(text: string): string {
    const lines = text.split('\n');
    const justifiedLines = lines.map(line => justifyLine(line));
    console.log(justifiedLines.join('\n'));
    return justifiedLines.join('\n');
}

function justifyLine(line: string): string {
    const words = line.split(' ');
    const result: string[] = [];
    let currentList: string[] = [];
    let numOfLetters = 0;

    for (const word of words) {
        if (numOfLetters + word.length + currentList.length > LINE_LENGTH) {
            const size = Math.max(1, currentList.length - 1);

            for (let i = 0; i < LINE_LENGTH - numOfLetters; i++) {
                const index = i % size;
                currentList[index] += ' ';
            }

            result.push(currentList.join(''));
            currentList = [];
            numOfLetters = 0;
        }

        currentList.push(word);
        numOfLetters += word.length;
    }

    const lastLine = currentList.join(' ').padEnd(LINE_LENGTH);
    result.push(lastLine);

    return result.join('\n'); // Join the lines into a single paragraph

}
