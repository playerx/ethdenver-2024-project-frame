import { getReversedDisks } from "./getReversedDisks.ts";
import { Move, Point, State } from "./types.ts";

export function generatePossibleMoves(state: State): Move[] {
  const result: Point[] = [];

  const cells = state.cells;

  for (let y = 0; y < cells.length; y++) {
    for (let x = 0; x < cells[0].length; x++) {
      if (cells[y][x]) {
        continue;
      }

      const point = <Point>{ x, y };

      if (getReversedDisks(state, point, cells).length) {
        result.push(point);
      }
    }
  }

  return result.map((x) => [state.activeTeamId, x.y, x.x]);
}
