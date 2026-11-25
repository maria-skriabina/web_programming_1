import { useEffect, useState } from "react";
import Encyclopedia from "./Encyclopedia.jsx";
import { houses, heroes, quotes } from "./data.js";

const images = import.meta.glob("/images/*", {
  eager: true,
  query: "?url",
  import: "default",
});

const wikiUrl = "https://gameofthrones.fandom.com/ru/wiki/HBO";

function Header({ fire, onThemeToggle }) {
  return (
    <header className="site-header">
      <button
        id="theme-toggle"
        type="button"
        className="btn-theme"
        onClick={onThemeToggle}
      >
        {fire ? "Тёмная тема" : "Красная тема"}
      </button>

      <h1>ICE OR FIRE</h1>

      <p className="site-description">
        Данный сайт создан истинными фанатами вселенной «Игра престолов» и
        предназначен для быстрого ознакомления с великими домами и главными
        героями сериала.
      </p>

      <p className="spoiler-warning">
        ⚠️ Внимание! Сайт содержит спойлеры. Если вы ещё не смотрели сериал —
        будьте осторожны.
      </p>

      <nav className="site-nav">
        <a href={wikiUrl} target="_blank" rel="noopener noreferrer">
          Официальная страница HBO на вики
        </a>
      </nav>
    </header>
  );
}

function StaticCard({ card, kind }) {
  const [spoilerOpen, setSpoilerOpen] = useState(false);

  return (
    <article className={`card ${kind}-card`}>
      <img src={images[`/${card.image}`]} alt={card.alt} />

      <h3>{card.title}</h3>

      {card.fields.map((field, index) => (
        <p key={`${field.label}-${index}`}>
          <strong>{field.label}:</strong> {field.value}
        </p>
      ))}

      {card.description && (
        <p className={kind === "character" ? "short-desc" : undefined}>
          {card.description}
        </p>
      )}

      {card.spoiler && (
        <>
          <button
            className="btn-details"
            type="button"
            aria-expanded={spoilerOpen}
            onClick={() => setSpoilerOpen((value) => !value)}
          >
            {spoilerOpen ? "Скрыть спойлер" : "Показать спойлер"}
          </button>

          <div className="spoiler-content" hidden={!spoilerOpen}>
            <p>{card.spoiler}</p>
          </div>
        </>
      )}
    </article>
  );
}

function CardsSection({ id, title, items, kind, subject }) {
  const [visible, setVisible] = useState(true);

  return (
    <section id={id} className="section">
      <h2>{title}</h2>

      <button
        id={`toggle-${id}`}
        className="btn-toggle"
        type="button"
        aria-expanded={visible}
        onClick={() => setVisible((value) => !value)}
      >
        {visible ? `Скрыть ${subject}` : `Показать ${subject}`}
      </button>

      <div
        className={
          visible ? "cards-container" : "cards-container hidden-section"
        }
      >
        {items.map((card) => (
          <StaticCard key={card.id} card={card} kind={kind} />
        ))}
      </div>
    </section>
  );
}

function QuotesSection() {
  const [quote, setQuote] = useState(
    "Нажмите кнопку, чтобы увидеть случайную цитату.",
  );

  function showQuote() {
    const index = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[index]);
  }

  return (
    <section id="quotes" className="section">
      <h2>Мудрость Вестероса</h2>

      <p id="quote-display" className="quote-text">
        {quote}
      </p>

      <button
        id="btn-quote"
        className="btn-primary"
        type="button"
        onClick={showQuote}
      >
        Случайная цитата
      </button>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <p>
        © 2026 Учебный проект. Все права на вселенную «Игра престолов»
        принадлежат Дж. Р. Р. Мартину и HBO.
      </p>

      <p>
        <a href={wikiUrl} target="_blank" rel="noopener noreferrer">
          Источник вдохновения — вики по «Игре престолов»
        </a>
      </p>
    </footer>
  );
}

function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <button
      id="scroll-top"
      type="button"
      title="Наверх"
      aria-label="Наверх"
      className={visible ? "visible" : ""}
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }}
    >
      ↑
    </button>
  );
}

export default function App() {
  const [fire, setFire] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("fire-theme", fire);

    return () => {
      document.body.classList.remove("fire-theme");
    };
  }, [fire]);

  return (
    <>
      <Header fire={fire} onThemeToggle={() => setFire((value) => !value)} />

      <main>
        <CardsSection
          id="houses"
          title="Великие Дома Вестероса"
          items={houses}
          kind="house"
          subject="дома"
        />

        <CardsSection
          id="characters"
          title="Главные герои"
          items={heroes}
          kind="character"
          subject="персонажей"
        />

        <Encyclopedia />

        <QuotesSection />
      </main>

      <Footer />

      <ScrollTopButton />
    </>
  );
}
