// Инициализация начальных параметров
let score = 0; // Начальный счет
let lives = 3; // Начальное количество жизней
const field = document.getElementById('field');
const scoreElement = document.getElementById('score');
const character = document.getElementById('personage'); // Элемент персонажа
const livesElements = document.querySelectorAll('.health'); // Массив элементов жизней

// Проверка подключения элементов
if (!field || !character || !scoreElement) {
    console.error("Ошибка: элемент field, character или scoreElement не найден.");
}

// Движение персонажа при удержании кнопок
let isMovingLeft = false;
let isMovingRight = false;
const moveSpeed = 15;

// Управление кнопками
const buttonLeft = document.getElementById('button-left');
const buttonRight = document.getElementById('button-right');

if (buttonLeft && buttonRight) {
    buttonLeft.addEventListener('pointerdown', () => { isMovingLeft = true; });
    buttonLeft.addEventListener('pointerup', () => { isMovingLeft = false; });
    buttonLeft.addEventListener('pointerout', () => { isMovingLeft = false; });

    buttonRight.addEventListener('pointerdown', () => { isMovingRight = true; });
    buttonRight.addEventListener('pointerup', () => { isMovingRight = false; });
    buttonRight.addEventListener('pointerout', () => { isMovingRight = false; });

    // Отключаем контекстное меню для кнопок
    buttonLeft.addEventListener('contextmenu', (event) => event.preventDefault());
    buttonRight.addEventListener('contextmenu', (event) => event.preventDefault());
}

// Отключаем контекстное меню для всего игрового поля
field.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});

// Глобальная обработка отпускания кнопок
window.addEventListener('pointerup', () => {
    isMovingLeft = false;
    isMovingRight = false;
});

function moveCharacter() {
    if (isMovingLeft && character.offsetLeft > 0) {
        character.style.left = `${character.offsetLeft - moveSpeed}px`;
    }
    if (isMovingRight && character.offsetLeft < field.offsetWidth - character.offsetWidth) {
        character.style.left = `${character.offsetLeft + moveSpeed}px`;
    }
    requestAnimationFrame(moveCharacter);
}
moveCharacter();

// Функция для создания фрукта
function createFruit() {
    const fruitImages = ['./images/fruit_apple.png', './images/fruit_orange.png', './images/fruit_pineapple.png'];
    const fruit = document.createElement('img');

    fruit.src = fruitImages[Math.floor(Math.random() * fruitImages.length)];
    fruit.classList.add('fruit');
    fruit.style.position = 'absolute';
    fruit.style.left = `${Math.random() * (field.offsetWidth - 50)}px`;
    fruit.style.top = '0px';

    field.appendChild(fruit);

    // Анимация падения фрукта
    function fall() {
        const fruitRect = fruit.getBoundingClientRect();
        const characterRect = character.getBoundingClientRect();

        // Проверка столкновения
        if (
            fruitRect.bottom >= characterRect.top &&
            fruitRect.left < characterRect.right &&
            fruitRect.right > characterRect.left
        ) {
            field.removeChild(fruit);
            increaseScore();
            return;
        }

        // Падение фрукта вниз
        if (parseInt(fruit.style.top) < field.offsetHeight - 50) {
            fruit.style.top = `${parseInt(fruit.style.top) + 5}px`; // Скорость падения
            requestAnimationFrame(fall);
        } else {
            field.removeChild(fruit);
            decreaseLife();
        }
    }

    requestAnimationFrame(fall);
}

// Функция для увеличения счета
function increaseScore() {
    score += 1;
    scoreElement.textContent = `score: ${score}`;
}

// Функция для уменьшения жизней
function decreaseLife() {
    if (lives > 0) {
        lives -= 1;
        livesElements[lives].style.display = 'none';
    }

    if (lives <= 0) {
        alert('Game Over! Ваш счёт: ' + score);
        location.reload();
    }
}

// Функция для сброса игры
function resetGame() {
    score = 0;
    lives = 3;
    scoreElement.textContent = `score: ${score}`;
    livesElements.forEach(life => life.style.display = 'inline');
}

// Периодически генерируем фрукты
setInterval(createFruit, 2000);
