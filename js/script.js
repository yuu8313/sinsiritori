// DOM
document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chatContainer');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const scoreElement = document.getElementById('score');
    const gameOverModal = document.getElementById('gameOverModal');
    const finalScoreElement = document.getElementById('finalScore');
    const restartButton = document.getElementById('restartButton');
    const modalTitle = document.getElementById('modalTitle');

    let score = 0;
    let lastWord = '';
    let usedWords = new Set();
    let resetTimeout = null;

    function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.display = 'block';
        userInput.value = '';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    function addMessage(text, isUser) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${isUser ? 'user-message' : 'ai-message'}`;
        bubble.textContent = text;
        chatContainer.appendChild(bubble);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function showGameOverModal() {
        modalTitle.textContent = 'ゲームオーバー!';
        finalScoreElement.textContent = score;
        gameOverModal.style.display = 'flex';
    }

    window.showClearModal = function() {
        modalTitle.textContent = 'クリア!';
        finalScoreElement.textContent = score;
        gameOverModal.style.display = 'flex';
    }
// はじめとかのためのやつ
    function resetGame() {
        score = 0;
        lastWord = '';
        usedWords.clear();
        scoreElement.textContent = '0';
        chatContainer.innerHTML = '';
        gameOverModal.style.display = 'none';
        addMessage('しりとりを始めましょう！', false);
    }

    function handleUserInput() {
        const word = userInput.value.trim();
        
        if (!word) return;
        
        if (!isValidInput(word)) {
            showNotification('ひらがなで入力してください');
            return;
        }

        if (isBlacklisted(word)) {
            showNotification('その言葉は使えません');
            return;
        }

        const normalizedWord = normalizeWord(word);
        if (usedWords.has(normalizedWord)) {
            showNotification('その言葉は既に使われています');
            return;
        }

        if (lastWord && !isValidContinuation(lastWord, normalizedWord)) {
            showNotification('前の言葉の最後の文字から始めてください');
            return;
        }

        addMessage(word, true);
        usedWords.add(normalizedWord);
        
        if (normalizedWord.endsWith('ん')) {
            showGameOverModal();
            return;
        }

        score += word.length;
        scoreElement.textContent = score;
        
        const aiResponse = getAIResponse(word);
        setTimeout(() => {
            addMessage(aiResponse, false);
            lastWord = aiResponse;
            
            if (aiResponse === '降参です！あなたの勝ちです！') {
                if (resetTimeout) clearTimeout(resetTimeout);
                setTimeout(() => {
                    showClearModal();
                }, 2000);
            }
        }, 3000);

        userInput.value = '';
    }

    sendButton.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserInput();
    });

    restartButton.addEventListener('click', resetGame);

    // 初期メッセージ
    addMessage('しりとりを始めましょう！', false);
});