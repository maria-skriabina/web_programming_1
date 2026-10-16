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


const themeButton = document.getElementById('theme-toggle');

if (themeButton) {
    themeButton.addEventListener('click', () => {
        document.body.classList.toggle('fire-theme');
        
        if (document.body.classList.contains('fire-theme')) {
            themeButton.textContent = 'Тёмная тема';
        } else {
            themeButton.textContent = 'Красная тема';
        }
    });
}


const scrollTopButton = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        scrollTopButton.classList.add('visible');
    } else {
        scrollTopButton.classList.remove('visible');
    }
});

scrollTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});


const toggleHousesBtn = document.getElementById('toggle-houses');
const housesContainer = document.querySelector('#houses .cards-container');

if (toggleHousesBtn && housesContainer) {
    toggleHousesBtn.addEventListener('click', () => {
        housesContainer.classList.toggle('hidden-section');
        
        if (housesContainer.classList.contains('hidden-section')) {
            toggleHousesBtn.textContent = 'Показать дома';
        } else {
            toggleHousesBtn.textContent = 'Скрыть дома';
        }
    });
}

const toggleCharactersBtn = document.getElementById('toggle-characters');
const charactersContainer = document.querySelector('#characters .cards-container');

if (toggleCharactersBtn && charactersContainer) {
    toggleCharactersBtn.addEventListener('click', () => {
        charactersContainer.classList.toggle('hidden-section');
        
        if (charactersContainer.classList.contains('hidden-section')) {
            toggleCharactersBtn.textContent = 'Показать героев';
        } else {
            toggleCharactersBtn.textContent = 'Скрыть героев';
        }
    });
}