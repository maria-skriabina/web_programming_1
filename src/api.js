import { MAIN_CHARACTERS } from "./data.js";

export async function fetchCharacters(signal) {
  return Promise.all(
    MAIN_CHARACTERS.map(async ({ id, name, house, culture }) => {
      const response = await fetch(
        `https://anapioficeandfire.com/api/characters/${id}`,
        {
          cache: "no-cache",
          signal: AbortSignal.any([signal, AbortSignal.timeout(10000)]),
        },
      );

      if (!response.ok) {
        throw new Error(`Сервер ответил ошибкой ${response.status}`);
      }

      const data = await response.json();

      return {
        ...data,
        id,
        ruName: name,
        house,
        ruCulture: culture,
      };
    }),
  );
}
