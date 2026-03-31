const BASE_URL = "http://student.plkcastar.edu.hk:7861";
let currentQuestions = [];
let currentIndex = 0;

// 初始化：獲取檔案清單
async function init() {
    const response = await fetch(`${BASE_URL}/pylingo`);
    const files = await response.json(); // 假設回傳 ["syntax.txt", "basic.txt"]
    const listDiv = document.getElementById('file-list');
    
    files.forEach(file => {
        const btn = document.createElement('button');
        btn.innerText = file.replace('.txt', '');
        btn.onclick = () => loadQuestions(file);
        listDiv.appendChild(btn);
    });
    fetchLeaderboard();
}

async function loadQuestions(filename) {
    const response = await fetch(`${BASE_URL}/pylingo/${filename}`);
    currentQuestions = await response.json();
    currentIndex = 0;
    showGame();
    displayQuestion();
}

let startX = 0;
const card = document.getElementById('current-card');

card.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);
card.addEventListener('touchmove', (e) => {
    let moveX = e.touches[0].clientX - startX;
    let rotation = moveX / 10;
    card.style.transform = `translateX(${moveX}px) rotate(${rotation}deg)`;
    
    // 顯示紅色/綠色遮罩
    document.querySelector('.overlay.right').style.opacity = Math.max(0, moveX / 100);
    document.querySelector('.overlay.left').style.opacity = Math.max(0, -moveX / 100);
});

card.addEventListener('touchend', (e) => {
    let moveX = e.changedTouches[0].clientX - startX;
    if (moveX > 150) checkAnswer(true);
    else if (moveX < -150) checkAnswer(false);
    else resetCard();
});

function checkAnswer(userChoice) {
    const correct = currentQuestions[currentIndex].answer;
    if (userChoice === correct) {
        // 答對了：噴射卡片並換下一張
        card.style.transition = '0.5s';
        card.style.transform = userChoice ? 'translateX(1000px) rotate(30deg)' : 'translateX(-1000px) rotate(-30deg)';
        setTimeout(nextQuestion, 300);
    } else {
        // 答錯了：彈回來
        resetCard();
        alert(`Wrong! ${currentQuestions[currentIndex].explain_chinese}`);
    }
}

function resetCard() {
    card.style.transform = 'translateX(0) rotate(0)';
    document.querySelectorAll('.overlay').forEach(el => el.style.opacity = 0);
}

async function fetchLeaderboard() {
    const res = await fetch(`${BASE_URL}/pylingodata/streaks`);
    const data = await res.json();
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = data.map(u => `<li>${u.username}: ${u.score} (Streak: ${u.loginstreak})</li>`).join('');
}

async function handleAuth(type) {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const url = `${BASE_URL}/pylingodata/${type}`;
    
    const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: u, password: p})
    });
    const result = await res.json();
    
    if (result.detail === "True" || result.message?.includes("success")) {
        alert("Success!");
        localStorage.setItem('currentUser', u);
        // 更新 UI 顯示已登入
    } else {
        alert("Failed: " + (result.detail || "Error"));
    }
}