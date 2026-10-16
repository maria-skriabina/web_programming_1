// спойлеры
const detailButtons = document.querySelectorAll('.btn-details');


detailButtons.forEach(button => {
    button.addEventListener('click', function() {
        const spoilerBlock = this.nextElementSibling;

        if (spoilerBlock.hasAttribute('hidden')) {
            spoilerBlock.removeAttribute('hidden');
            this.textContent = 'Скрыть спойлер';
            this.setAttribute('aria-expanded', 'true');
        } else {
            spoilerBlock.setAttribute('hidden', '');
            this.textContent = 'Показать спойлер';
            this.setAttribute('aria-expanded', 'false');
        }
    });
});


// цитаты
const quotes = [
    "Зима близко. (Winter is Coming)",
    "Ланнистеры всегда платят свои долги.",
    "Пламя и кровь. (Fire and Blood)",
    "Услышь мой рев! (Hear Me Roar!)",
    "Ночь темна и полна ужасов.",
    "Хаос — это лестница.",
    "Сила — это сила.",
    "Смерть — это еще не конец.",
    "Дракарис. (Dracarys)",
    "Валар Моргулис. (Valar Morghulis)",
    "Ты ничего не знаешь, Джон Сноу.",
    "Игра престолов — это игра, в которую можно либо выиграть, либо умереть."
];

const quoteButton = document.getElementById('btn-quote');
const quoteDisplay = document.getElementById('quote-display');

if (quoteButton && quoteDisplay) {
    quoteButton.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * quotes.length);

        quoteDisplay.textContent = quotes[randomIndex];

        quoteDisplay.style.opacity = '0';
        setTimeout(() => {
            quoteDisplay.style.opacity = '1';
        }, 150);
    });
}