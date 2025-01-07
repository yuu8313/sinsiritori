const blacklistedWords = [
    "あほ", "ばか", "くそ", "しね", "ごりらのきわみ", "おめーの席ねーから", "うんこ",
    "きもい", "ばばあ", "じじい", "だめ", "むかつく", "うざい",
    "くたばれ", "だれですか", "ころす", "ぶす", "でぶ", "はげ"
];

function isBlacklisted(word) {
    const normalizedWord = normalizeWord(word.toLowerCase());
    return blacklistedWords.some(banned => 
        normalizedWord.includes(banned) || 
        normalizeWord(banned).includes(normalizedWord)
    );
}