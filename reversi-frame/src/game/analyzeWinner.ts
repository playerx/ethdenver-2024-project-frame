import { DRAW, TeamId } from "./types.ts";

type ResultType = TeamId | typeof DRAW | null;

export function analyzeWinner(cells: (TeamId | null)[][]): ResultType {
  const items = cells.flat();

  const results = items.reduce(
    (r, x) => r.set(x, (r.get(x) ?? 0) + 1),
    new Map<string | null, number>()
  );

  const resultItems = [...results.entries()];

  // sort by value desc
  resultItems.sort((a, b) => b[1] - a[1]);

  const keys = [...results.keys()];

  if (keys.includes(null)) {
    // when one player owns all colors
    if (keys.length === 2) {
      return keys.find((x) => x !== null) ?? (null as any);
    }

    // continue playing
    return null;
  }

  if (keys.length === 0) {
    return keys[0] as any;
  }

  // draw
  if (resultItems[0][1] === resultItems[1][1]) {
    return DRAW;
  }

  return resultItems[0][0] as any;
}
