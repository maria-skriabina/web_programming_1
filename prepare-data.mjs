import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const api = readFileSync("api.js", "utf8");
const app = readFileSync("app.js", "utf8");

function text(value = "") {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCards(sectionId) {
  const section = html.match(
    new RegExp(`<section id="${sectionId}"[\\s\\S]*?</section>`),
  );

  if (!section) {
    throw new Error(`Не найдена секция ${sectionId}`);
  }

  return [...section[0].matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)].map(
    ([markup], index) => {
      const spoiler = markup.match(
        /<div class="spoiler-content"[^>]*>([\s\S]*?)<\/div>/,
      );

      const content = spoiler ? markup.replace(spoiler[0], "") : markup;

      const fields = [];
      const descriptions = [];

      for (const [, paragraph] of content.matchAll(
        /<p\b[^>]*>([\s\S]*?)<\/p>/g,
      )) {
        const label = paragraph.match(/<strong>([\s\S]*?)<\/strong>/);

        if (label) {
          fields.push({
            label: text(label[1]).replace(/:$/, ""),
            value: text(paragraph.replace(label[0], "")),
          });
        } else {
          descriptions.push(text(paragraph));
        }
      }

      return {
        id: `${sectionId}-${index}`,
        image: markup.match(/<img\b[^>]*src="([^"]+)"/)?.[1] || "",
        alt: markup.match(/<img\b[^>]*alt="([^"]+)"/)?.[1] || "",
        title: text(markup.match(/<h3>([\s\S]*?)<\/h3>/)?.[1]),
        fields,
        description: descriptions.join(" "),
        spoiler: text(spoiler?.[1]),
      };
    },
  );
}

function extractConstant(source, name) {
  const match = source.match(new RegExp(`const ${name} = ([\\s\\S]*?);`));

  if (!match) {
    throw new Error(`Не найдена константа ${name}`);
  }

  return `export const ${name} = ${match[1]};`;
}

const houses = extractCards("houses");
const heroes = extractCards("characters");

const constants = [
  "HOUSE_COLORS",
  "MAIN_CHARACTERS",
  "GENDERS",
  "CULTURES",
].map((name) => extractConstant(api, name));

mkdirSync("src", { recursive: true });

writeFileSync(
  "src/data.js",
  [
    `export const houses = ${JSON.stringify(houses, null, 2)};`,
    `export const heroes = ${JSON.stringify(heroes, null, 2)};`,
    extractConstant(app, "quotes"),
    ...constants,
  ].join("\n\n"),
  "utf8",
);

console.log(`Перенесено домов: ${houses.length}, героев: ${heroes.length}`);
