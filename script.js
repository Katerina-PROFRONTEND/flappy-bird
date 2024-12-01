// Инициализация Canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

// Загрузка изображений
const backgroundImage = new Image();
const birdImage = new Image();
const pipeImage = new Image();

const startBirdData = Object.freeze(
    { x: 100, y: 300, width: 40, height: 30, gravity: 1000, lift: -300, velocity: 0 }
);

// Переменные игры
let bird;
let pipes = [];
let score = 0;
let gameOver = false;
let gameStarted = false;

// Настройки труб
const pipeWidth = 100;
const pipeGap = 250;
const pipeDistanceBetween = 300;
const pipeSpeed = 400;
const backgroundSpeed = pipeSpeed / 2;

// Настройка фона
let backgroundX1 = 0;
let backgroundX2 = canvas.width;

let lastFrameTime = 0;

// Управление птицей
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!gameStarted) {
            gameStarted = true;
            lastFrameTime = performance.now();
            requestAnimationFrame(startGameLoop);
        } else {
            bird.velocity = bird.lift; // Прыжок птицы
        }
    }
    if (e.code === 'Enter' && gameOver) { // Рестарт игры
        startGame();
    }
});

function drawTopPartOfImageByCenter(img, x, y, width, height) {
    const imageRatio = img.width / img.height; // Соотношение сторон изображения
    const areaRatio = width / height; // Соотношение сторон целевой области
    let drawWidth, drawHeight;

    if (width < img.width) {
        // Если ширина области меньше ширины изображения, подгоняем по ширине
        drawWidth = width;
        drawHeight = width / imageRatio;
    } else if (imageRatio > areaRatio) {
        // Если изображение шире области, подгоняем по высоте
        drawHeight = height;
        drawWidth = height * imageRatio;
    } else {
        // Если изображение выше области, подгоняем по ширине
        drawWidth = width;
        drawHeight = width / imageRatio;
    }

    const offsetX = (width - drawWidth) / 2; // Центрируем по горизонтали
    // Отрисовываем изображение, начиная с верхней части области
    // Центрируем по оси X, Начинаем с верхней части по оси Y
    ctx.drawImage(img, x + offsetX, y, drawWidth, drawHeight);
}

function loadImage(src, img) {
    return new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
    });
}

// Функция рисования фона
function drawBackground(scale) {
    backgroundX1 -= backgroundSpeed * scale;
    backgroundX2 -= backgroundSpeed * scale;

    // Логика замыкания
    if (backgroundX1 + canvas.width <= 0) {
        backgroundX1 = canvas.width;
    }
    if (backgroundX2 + canvas.width <= 0) {
        backgroundX2 = canvas.width;
    }

    // Принудительное выравнивание, чтобы избежать накопления ошибок
    const gap = Math.abs(backgroundX1 - backgroundX2);
    if (gap > canvas.width) {
        if (backgroundX1 < backgroundX2) {
            backgroundX2 = backgroundX1 + canvas.width;
        } else {
            backgroundX1 = backgroundX2 + canvas.width;
        }
    }

    // Отрисовка фонов
    ctx.drawImage(backgroundImage, Math.floor(backgroundX1), 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, Math.floor(backgroundX2), 0, canvas.width, canvas.height);
}

// Отображение очков
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 20, 30);
}

// Добавление начальных труб
function addPipe() {

}

// Функция рисования труб
function drawPipe(pipe) {

}

// Старт игры
function startGame() {
    bird = {
        ...startBirdData
    };
    pipes = [];
    score = 0;
    gameOver = false;
    gameStarted = false;

    showReadyScreen();
}

// Функция для обновления игры
function updateGame(scale) {

}


// Экран готовности
function showReadyScreen() {

}

function startGameLoop(timestamp) {
    const deltaTime = timestamp - lastFrameTime; // Время, прошедшее с последнего кадра
    lastFrameTime = timestamp;

    let scale = deltaTime / 1000; // Высчитываем параметр "масштабирования" для других параметров относительно времени - одной секунды.
        // Например, если прошло всего 16,(6) миллисекунд (столько занимает 1 кадр, если у вас монитор имеет частоту 60 Гц)
        // и если скорость (velocity), например, 800 пикселей в 1 секунду, то птичка должна подвинуться на на 800 пикселей,
        // а всего на velocity(800) * (16,(6) / 1000) = 12.8 пикселей, т.к. времени прошло сильно меньше, чем 1 секунда.

    // Обновляем игру
    updateGame(scale);

    if (!gameOver) {
        requestAnimationFrame(startGameLoop); // Запрос следующего кадра
    }
}

// Загрузка всех изображений и старт игры
Promise.all([
    loadImage('./images/background_image.png', backgroundImage),
    loadImage('./images/bird.png', birdImage),
    loadImage('./images/pipe.png', pipeImage)
]).then(() => {
    startGame(); // Начать игру после загрузки всех изображений
}).catch(() =>{
    console.log('Произошла ошибка при загрузке изображений. Игра не может быть запущена.');
});