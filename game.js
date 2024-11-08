// game.js
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

document.getElementById('button-left').addEventListener('mousedown', () => { isMovingLeft = true; });
document.getElementById('button-left').addEventListener('mouseup', () => { isMovingLeft = false; });
document.getElementById('button-right').addEventListener('mousedown', () => { isMovingRight = true; });
document.getElementById('button-right').addEventListener('mouseup', () => { isMovingRight = false; });

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
    console.log("Создание нового фрукта...");

    const fruitImages = ['./images/fruit_apple.png', './images/fruit_orange.png', './images/fruit_pineapple.png'];
    const fruit = document.createElement('img');
    
    fruit.src = fruitImages[Math.floor(Math.random() * fruitImages.length)];
    fruit.classList.add('fruit');
    fruit.style.position = 'absolute';
    fruit.style.left = `${Math.random() * (field.offsetWidth - 50)}px`;
    fruit.style.top = '0px';

    field.appendChild(fruit);
    console.log("Фрукт добавлен на поле.");

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
            console.log("Фрукт пойман!");
            field.removeChild(fruit);
            increaseScore();
            return; // Завершаем выполнение
        }

        // Падение фрукта вниз
        if (parseInt(fruit.style.top) < field.offsetHeight - 50) {
            fruit.style.top = `${parseInt(fruit.style.top) + 5}px`; // Скорость падения
            requestAnimationFrame(fall); // Продолжаем анимацию
        } else {
            console.log("Фрукт не пойман!");
            field.removeChild(fruit);
            decreaseLife();
        }
    }

    // Запускаем падение фрукта
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
        console.log(`Осталось жизней: ${lives}`);
        // Обновляем отображение жизней
        livesElements[lives].style.display = 'none'; // Скрыть картинку жизни
    }

    if (lives <= 0) {
        alert('Game Over! Ваш счёт: ' + score);
        // resetGame();
        location.reload(); // Перезагрузка страницы
    }
}

// Функция для сброса игры
function resetGame() {
    score = 0;
    lives = 3;
    scoreElement.textContent = `score: ${score}`;
    // Отображаем все жизни
    livesElements.forEach(life => life.style.display = 'inline');
}

// Периодически генерируем фрукты
setInterval(createFruit, 2000); // Каждые 2 секунды появляется новый фрукт
