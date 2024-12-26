import { Heroe } from "../../interfaces/heroe.interface";

export class Utils {
  static binarySearch(heroes: Heroe[], query: string): Heroe[] {
    let left = 0;
    let right = heroes.length - 1;
    const matches: Heroe[] = [];

    // Buscamos las coincidencias utilizando búsqueda binaria
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const hero = heroes[mid];

      if (hero.superhero.toLowerCase().includes(query.toLowerCase())) {
        matches.push(hero);
        // Después de encontrar una coincidencia, buscamos hacia la izquierda y derecha
        let leftIndex = mid - 1;
        let rightIndex = mid + 1;

        // Buscar hacia la izquierda
        while (leftIndex >= 0 && heroes[leftIndex].superhero.toLowerCase().includes(query.toLowerCase())) {
          matches.push(heroes[leftIndex]);
          leftIndex--;
        }

        // Buscar hacia la derecha
        while (rightIndex < heroes.length && heroes[rightIndex].superhero.toLowerCase().includes(query.toLowerCase())) {
          matches.push(heroes[rightIndex]);
          rightIndex++;
        }

        break; // Ya hemos encontrado una coincidencia y buscamos hacia los lados
      }

      if (hero.superhero.toLowerCase() < query.toLowerCase()) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return matches;
  }
}
