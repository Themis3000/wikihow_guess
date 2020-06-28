const instructionsDiv = document.getElementById("instructions");
const gameDiv = document.getElementById("game_div");
const optionsDisplay = document.getElementById("options_display");
const imageDisplay = document.getElementById("image_display");
const timerDisplay = document.getElementById("timer_display");
const postGameDiv = document.getElementById("post_game_div");
const postScore = document.getElementById("post_score");
const scoreDisplay = document.getElementById("score");
const hintsDisplay = document.getElementById("hints_left");
const livesDisplay = document.getElementById("health");
let cachedRounds = [];
let articles;
let chosenArticleIndex;
let gameData;
let health;
let points;
let options;
let hintPos;
let timerStart;
let timer;
let hints;

let gameDataRequest = new XMLHttpRequest();
gameDataRequest.onreadystatechange = function() {
    if (gameDataRequest.readyState === 4 && gameDataRequest.status === 200) {
        gameData = JSON.parse(gameDataRequest.responseText);
        cacheRounds(5, 2);
        let startButton = document.getElementById('start_button');
        startButton.innerText = "Play";
        startButton.disabled = false;
    }
}
gameDataRequest.open("GET", "/wikihow_guess/articles_dir.txt");
gameDataRequest.send();

options = 6;

function startGame() {
    instructionsDiv.style.display = "none";
    postGameDiv.style.display = "none";
    gameDiv.style.display = "block";
    hints = 4;
    health = 3;
    points = 0;
    timerStart = 45;
    hintsDisplay.innerText = hints;
    livesDisplay.innerText = health;
    startRound();
    startTimer();
}

function optionClick(x) {
    if (x == chosenArticleIndex) {
        points++;
        startRound();
    } else {
        --health;
        livesDisplay.innerText = health;
        let option = document.getElementById(`option${x}`)
        option.className = "option btn btn-danger";
        option.disabled = true;
        if (health < 1)
            endGame()
    }
}

function startRound() {
    scoreDisplay.innerText = points;
    optionsDisplay.innerHTML = "";
    imageDisplay.innerHTML = "";
    let cachedArticles = cachedRounds.shift();
    articles = cachedArticles["articles"];
    chosenArticleIndex = cachedArticles["correct_index"];
    hintPos = 0;
    cacheRounds(1, 2);
    displayHint(false);
    for (let articleIndex in articles) {
        let optionButton = document.createElement("button");
        optionButton.onclick = function () {optionClick(articleIndex)}
        optionButton.id = `option${articleIndex}`;
        optionButton.className = "option btn btn-secondary";
        optionButton.innerText = articles[articleIndex]["title"];
        optionsDisplay.appendChild(optionButton);
    }
}

function displayHint(deductHint=true) {
    if (deductHint)
        if (hints > 0){
            --hints;
            hintsDisplay.innerText = hints;
        } else {
            return null;
        }
    let image = document.createElement("img");
    image.src = articles[chosenArticleIndex]["images"][hintPos];
    hintPos++;
    imageDisplay.appendChild(image);
}

function endGame() {
    clearTimeout(timer);
    gameDiv.style.display = "none";
    postGameDiv.style.display = "block";
    postScore.innerText = points;
}

function cacheRounds(rounds=5, imagesPerRound=2) {
    let chosenArticleIndexCache;
    let articlesCache;
    for (let round=0; round<rounds; round++) {
        articlesCache = getRandomArticles(options);
        chosenArticleIndexCache = Math.floor(Math.random() * articlesCache.length);
        articlesCache[chosenArticleIndexCache]["images"] = shuffleArray(articlesCache[chosenArticleIndexCache]["images"]);
        for (let image=0; image<imagesPerRound; image++)
            cacheImg(articlesCache[chosenArticleIndexCache]["images"][image]);
        cachedRounds.push({"articles": articlesCache, "correct_index": chosenArticleIndexCache});
    }
}

function cacheImg(src) {
    let temp_img = new Image();
    temp_img.src = src;
    temp_img.onerror = function () {cacheImgErrorHandler(src)};
}

function cacheImgErrorHandler(src) {
    for (let key in cachedRounds) {
        if (cachedRounds[key][cachedRounds[key]["correct_index"]]["images"].includes(src)) {
            cachedRounds.remove(key);
            cacheRounds(1, 2);
            break;
        }
    }
}

function shuffleArray(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function getRandomArticles(n) {
    let x;
    let requiredLen = 3;
    var result = new Array(n),
        len = gameData.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        while (typeof result[n] === 'undefined' || result[n]["images"].length < requiredLen) {
            x = Math.floor(Math.random() * len);
            result[n] = gameData[x in taken ? taken[x] : x];
        }
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function startTimer() {
    timerDisplay.innerText = timerStart;
    timer = setTimeout(timerTimeoutHandler, 1000);
}

function timerTimeoutHandler() {
    let presentTime = parseInt(timerDisplay.innerText);
    if (presentTime > 0) {
        timerDisplay.innerText = --presentTime;
        timer = setTimeout(timerTimeoutHandler, 1000);
    } else {
        endGame();
    }
}