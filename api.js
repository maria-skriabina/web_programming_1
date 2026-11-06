import './api.css';
import { translateValues, translateBirth } from './api-translations.js';

const API_URL = 'https://anapioficeandfire.com/api/characters';
const REQUEST_TIMEOUT_MS = 10_000;

const HOUSE_COLORS = {
   'Старк': '#8fa1b3',       
  'Ланнистер': '#d4af37',   
  'Таргариен': '#8b0000',   
  'Баратеон': '#4a4a4a',    
  'Тирелл': '#2e7d32',      
  'Мартелл': '#ff8c00',     
  'Грейджой': '#2c3e50', 
  'Талли': '#4682b4',  
  'Аррен': '#87ceeb',        
  'Другие': '#95a5a6'       
};

const MAIN_CHARACTERS = [
  { id: 339, name: 'Эддард Старк', house: 'Старк' },
  { id: 232, name: 'Кейтилин Старк', house: 'Талли' },
  { id: 1880, name: 'Робб Старк', house: 'Старк', culture: 'Северяне' },
  { id: 957, name: 'Санса Старк', house: 'Старк' },
  { id: 148, name: 'Арья Старк', house: 'Старк' },
  { id: 208, name: 'Бран Старк', house: 'Старк' },
  { id: 583, name: 'Джон Сноу', house: 'Старк' },
  { id: 1303, name: 'Дейенерис Таргариен', house: 'Таргариен' },
  { id: 1052, name: 'Тирион Ланнистер', house: 'Ланнистер', culture: 'Западные земли' },
  { id: 238, name: 'Серсея Ланнистер', house: 'Ланнистер' },
  { id: 529, name: 'Джейме Ланнистер', house: 'Ланнистер' },
  { id: 27, name: 'Тайвин Ланнистер', house: 'Ланнистер', culture: 'Западные земли' },
  { id: 565, name: 'Джоффри Баратеон', house: 'Баратеон', culture: 'Королевские земли' },
  { id: 1963, name: 'Станнис Баратеон', house: 'Баратеон', culture: 'Штормовые земли' },
  { id: 16, name: 'Маргери Тирелл', house: 'Тирелл', culture: 'Простор' },
  { id: 1770, name: 'Оберин Мартелл', house: 'Мартелл' },
  { id: 1022, name: 'Теон Грейджой', house: 'Грейджой' },
  { id: 216, name: 'Бриенна Тарт', house: 'Другие', culture: 'Штормовые земли' },
  { id: 955, name: 'Сандор Клиган (Пёс)', house: 'Другие', culture: 'Западные земли' },
  { id: 823, name: 'Петир Бейлиш (Мизинец)', house: 'Другие' },
  { id: 2069, name: 'Варис (Паук)', house: 'Другие', culture: 'Вольные города (Лис)' },
  { id: 954, name: 'Сэмвелл Тарли', house: 'Другие' },
  { id: 1319, name: 'Давос Сиворт', house: 'Другие', culture: 'Королевские земли' },
  { id: 743, name: 'Мелисандра', house: 'Другие' },
];

const GENDERS = {
  Male: 'Мужской',
  Female: 'Женский',
};

const CULTURES = {
  Northmen: 'Северяне',
  Rivermen: 'Речные земли',
  Valyrian: 'Валирийцы',
  Westerman: 'Западные земли',
  Westerlands: 'Западные земли',
  Westeros: 'Вестерос',
  Dornish: 'Дорнийцы',
  Ironborn: 'Железнорождённые',
  Valemen: 'Долина Аррен',
  Andal: 'Андалы',
  Asshai: 'Асшай',
  'First Men': 'Первые Люди',
};

const INITIAL_COUNT = 6;

const section = document.getElementById('encyclopedia');
const app = document.getElementById('api-app');
const searchInput = document.getElementById('search');
const houseSelect = document.getElementById('house-filter');
const refreshButton = document.getElementById('btn-refresh');
const resetButton = document.getElementById('btn-reset');

let characters = [];

let expanded = false;

async function fetchCharacter({ id, name, house, culture }) {
  const response = await fetch(`${API_URL}/${id}`, {
    cache: 'no-cache',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Сервер ответил ошибкой ${response.status} ${response.statusText}`.trim());
  }

  const data = await response.json();
  return { ...data, ruName: name, house, ruCulture: culture };
}

export async function fetchCharacters() {
  return Promise.all(MAIN_CHARACTERS.map(fetchCharacter));
}

function formatBirthYear(born = '') {
  const years = born.match(/\d+(?=\s*AC)/g);
  if (!years) return '';

  const text = `${years.join(' или ')} г. от Завоевания Эйгона`;
  return /or before/i.test(born) ? `не позднее ${text}` : text;
}

function createField(label, value) {
  const p = document.createElement('p');
  const strong = document.createElement('strong');
  strong.textContent = `${label}:`;
  p.append(strong, ` ${value || 'Неизвестно'}`);
  return p;
}

function createCard(character) {
  const card = document.createElement('article');
  card.className = 'card api-card';

  const houseColor = HOUSE_COLORS[character.house] || HOUSE_COLORS['Другие'];
  card.style.setProperty('--house-color', houseColor);

  const title = document.createElement('h3');
  title.textContent = character.ruName;

  card.append(
    title,
    createField('Дом', character.house),
    createField('Пол', GENDERS[character.gender] ?? character.gender),
    createField('Культура', character.ruCulture ?? CULTURES[character.culture] ?? character.culture),
    createField('В роли', character.playedBy?.find(Boolean)),
    createField('Год рождения', formatBirthYear(character.born)),
  );

  const details = document.createElement('details');
  details.className = 'api-details';
  const summary = document.createElement('summary');
  summary.textContent = 'Подробности персонажа';
  details.append(
    summary,
    createField('Титулы', translateValues(character.titles)),
    createField('Прозвища', translateValues(character.aliases)),
    createField('Рождение', translateBirth(character.born)),
  );
  card.append(details);

  return card;
}

function createExpandButton(total) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn-toggle api-expand';
  button.textContent = expanded ? 'Свернуть' : `Показать всех (${total})`;
  button.setAttribute('aria-expanded', String(expanded));

  button.addEventListener('click', () => {
    expanded = !expanded;
    renderCharacters(filterCharacters());
    if (!expanded) section.scrollIntoView({ behavior: 'smooth' });
  });

  return button;
}

export function renderCharacters(list) {
  if (list.length === 0) {
    showStatus('Ничего не найдено. Попробуйте другое имя или дом.', 'empty');
    return;
  }

  const canCollapse = !isFiltering() && list.length > INITIAL_COUNT;
  const visible = canCollapse && !expanded ? list.slice(0, INITIAL_COUNT) : list;

  const grid = document.createElement('div');
  grid.className = 'cards-container api-cards';
  grid.append(...visible.map(createCard));

  const counter = document.createElement('p');
  counter.className = 'api-counter';
  counter.textContent = isFiltering()
    ? `Найдено персонажей: ${list.length} из ${characters.length}`
    : `Показано персонажей: ${visible.length} из ${characters.length}`;

  app.replaceChildren(counter, grid);

  if (canCollapse) app.append(createExpandButton(list.length));
}

function showStatus(message, type) {
  const status = document.createElement('p');
  status.className = `api-status api-status--${type}`;
  status.textContent = message;
  app.replaceChildren(status);
  return status;
}

function showLoading() {
  showStatus('Загрузка… Вороны летят из Цитадели', 'loading');
}

function showError(error) {
  const reason = error.name === 'TimeoutError'
    ? `Сервер не ответил за ${REQUEST_TIMEOUT_MS / 1000} секунд.`
    : error.message;
  const status = showStatus(`Не удалось получить свитки мейстеров. ${reason}`, 'error');

  const retryButton = document.createElement('button');
  retryButton.type = 'button';
  retryButton.className = 'btn-primary api-retry';
  retryButton.textContent = 'Повторить';
  retryButton.addEventListener('click', loadCharacters);

  status.after(retryButton);
}

function setControls({ filters, refresh }) {
  searchInput.disabled = !filters;
  houseSelect.disabled = !filters;
  resetButton.disabled = !filters || !isFiltering();
  refreshButton.disabled = !refresh;
}

function isFiltering() {
  return searchInput.value.trim() !== '' || houseSelect.value !== '';
}

function filterCharacters() {
  const query = searchInput.value.trim().toLowerCase();
  const house = houseSelect.value;

  return characters.filter((character) => {
    const matchesHouse = !house || character.house === house;
    const matchesName = [character.ruName, character.name]
      .some((name) => name?.toLowerCase().includes(query));
    return matchesHouse && matchesName;
  });
}

function fillHouseOptions() {
  const houses = [...new Set(MAIN_CHARACTERS.map((c) => c.house))];
  houseSelect.append(...houses.map((house) => new Option(house, house)));
}

async function loadCharacters() {
  showLoading();
  setControls({ filters: false, refresh: false });

  try {
    characters = await fetchCharacters();
    renderCharacters(filterCharacters());
    setControls({ filters: true, refresh: true });
  } catch (error) {
    characters = [];
    showError(error);
    setControls({ filters: false, refresh: true });
  }
}

if (section && app && searchInput && houseSelect && refreshButton && resetButton) {
  fillHouseOptions();

  const update = () => {
    renderCharacters(filterCharacters());
    resetButton.disabled = !isFiltering();
  };
  resetButton.addEventListener('click', () => {
    searchInput.value = '';
    houseSelect.value = '';
    expanded = false;
    update();
    searchInput.focus();
  });
  searchInput.addEventListener('input', update);
  houseSelect.addEventListener('change', update);
  refreshButton.addEventListener('click', loadCharacters);

  loadCharacters();
}
