function getAIResponse(userWord) {
    const normalizedWord = normalizeWord(userWord);
    const lastChar = normalizedWord.slice(-1);
    const possibleWords = wordDatabase[lastChar] || [];
    
    if (possibleWords.length === 0) {
        return "降参です！あなたの勝ちです！";
    }

    const unusedWords = possibleWords.filter(word => !usedWords.has(word));
    
    if (unusedWords.length === 0) {
        return "降参です！あなたの勝ちです！";
    }

    const nonNWords = unusedWords.filter(word => !word.startsWith("ん"));
    const nWords = unusedWords.filter(word => word.startsWith("ん"));

    let aiWord;
    if (nonNWords.length > 0) {
        const nonNWordsWithoutNEnding = nonNWords.filter(word => !normalizeWord(word).endsWith("ん"));
        if (nonNWordsWithoutNEnding.length > 0) {
            aiWord = nonNWordsWithoutNEnding[Math.floor(Math.random() * nonNWordsWithoutNEnding.length)];
        } else {
            aiWord = nonNWords[Math.floor(Math.random() * nonNWords.length)];
        }
    } else if (nWords.length > 0) {
        aiWord = nWords[Math.floor(Math.random() * nWords.length)];
    } else {
        return "降参です！あなたの勝ちです！";
    }
    
    usedWords.add(aiWord);

    const normalizedAiWord = normalizeWord(aiWord);
    if (normalizedAiWord.endsWith("ん")) {
        setTimeout(() => {
            showClearModal();
        }, 1000);
        return aiWord + "。私の負けです！";
    }

    return aiWord;
}