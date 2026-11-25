import { useEffect, useRef, useState } from "react";
import { fetchCharacters } from "./api.js";
import { HOUSE_COLORS, MAIN_CHARACTERS, GENDERS, CULTURES } from "./data.js";
import { translateValues, translateBirth } from "../api-translations.js";

const houses = [
  ...new Set(MAIN_CHARACTERS.map((character) => character.house)),
];

function Field({ label, value }) {
  return (
    <p>
      <strong>{label}:</strong> {value || "Неизвестно"}
    </p>
  );
}

function formatBirthYear(born = "") {
  const years = born.match(/\d+(?=\s*AC)/g);

  if (!years) return "";

  const prefix = /or before/i.test(born) ? "не позднее " : "";

  return `${prefix}${years.join(" или ")} г. от Завоевания Эйгона`;
}

function CharacterCard({ character }) {
  const color = HOUSE_COLORS[character.house] || HOUSE_COLORS["Другие"];

  return (
    <article className="card api-card" style={{ "--house-color": color }}>
      <h3>{character.ruName}</h3>

      <Field label="Дом" value={character.house} />

      <Field
        label="Пол"
        value={GENDERS[character.gender] ?? character.gender}
      />

      <Field
        label="Культура"
        value={
          character.ruCulture ??
          CULTURES[character.culture] ??
          character.culture
        }
      />

      <Field label="В роли" value={character.playedBy?.find(Boolean)} />

      <Field label="Год рождения" value={formatBirthYear(character.born)} />

      <details className="api-details">
        <summary>Подробности персонажа</summary>

        <Field label="Титулы" value={translateValues(character.titles)} />

        <Field label="Прозвища" value={translateValues(character.aliases)} />

        <Field label="Рождение" value={translateBirth(character.born)} />
      </details>
    </article>
  );
}

export default function Encyclopedia() {
  const [characters, setCharacters] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [house, setHouse] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [request, setRequest] = useState(0);

  const searchRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchCharacters(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;

        setCharacters(data);
        setStatus("success");
      })
      .catch((reason) => {
        if (controller.signal.aborted) return;

        setCharacters([]);

        setError(
          reason.name === "TimeoutError"
            ? "Сервер не ответил за 10 секунд."
            : reason.message,
        );

        setStatus("error");
      });

    return () => controller.abort();
  }, [request]);

  const query = search.trim().toLowerCase();
  const filtering = query !== "" || house !== "";
  const ready = status === "success";

  const filtered = characters.filter((character) => {
    const matchesHouse = !house || character.house === house;

    const matchesName = [character.ruName, character.name].some((name) =>
      name?.toLowerCase().includes(query),
    );

    return matchesHouse && matchesName;
  });

  const canCollapse = !filtering && filtered.length > 6;

  const visible = canCollapse && !expanded ? filtered.slice(0, 6) : filtered;

  function reload() {
    setStatus("loading");
    setError("");
    setRequest((value) => value + 1);
  }

  function resetFilters() {
    setSearch("");
    setHouse("");
    setExpanded(false);
    searchRef.current?.focus();
  }

  function toggleExpanded() {
    setExpanded((value) => !value);

    if (expanded) {
      sectionRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }

  return (
    <section id="encyclopedia" className="section" ref={sectionRef}>
      <h2>Живая энциклопедия персонажей</h2>

      <p className="api-intro">
        Свитки мейстеров Цитадели: сведения о героях сериала.
      </p>

      <div className="api-controls">
        <input
          id="search"
          className="api-search"
          type="text"
          ref={searchRef}
          placeholder="Поиск по имени, например «Джон»…"
          aria-label="Поиск персонажа по имени"
          autoComplete="off"
          value={search}
          disabled={!ready}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          id="house-filter"
          className="api-search api-select"
          aria-label="Фильтр по дому"
          value={house}
          disabled={!ready}
          onChange={(event) => setHouse(event.target.value)}
        >
          <option value="">Все дома</option>

          {houses.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>

        <button
          id="btn-reset"
          className="btn-toggle"
          type="button"
          disabled={!ready || !filtering}
          onClick={resetFilters}
        >
          Сбросить фильтры
        </button>

        <button
          id="btn-refresh"
          className="btn-toggle"
          type="button"
          disabled={status === "loading"}
          onClick={reload}
        >
          Обновить
        </button>
      </div>

      <div id="api-app" aria-live="polite" aria-busy={status === "loading"}>
        {status === "loading" && (
          <p className="api-status api-status--loading">
            Загрузка… Вороны летят из Цитадели
          </p>
        )}

        {status === "error" && (
          <>
            <p className="api-status api-status--error">
              Не удалось получить свитки мейстеров. {error}
            </p>

            <button
              className="btn-primary api-retry"
              type="button"
              onClick={reload}
            >
              Повторить
            </button>
          </>
        )}

        {ready && filtered.length === 0 && (
          <p className="api-status api-status--empty">
            Ничего не найдено. Попробуйте другое имя или дом.
          </p>
        )}

        {ready && filtered.length > 0 && (
          <>
            <p className="api-counter">
              {filtering
                ? `Найдено персонажей: ${filtered.length} из ${characters.length}`
                : `Показано персонажей: ${visible.length} из ${characters.length}`}
            </p>

            <div className="cards-container api-cards">
              {visible.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
            </div>

            {canCollapse && (
              <button
                className="btn-toggle api-expand"
                type="button"
                aria-expanded={expanded}
                onClick={toggleExpanded}
              >
                {expanded ? "Свернуть" : `Показать всех (${filtered.length})`}
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
