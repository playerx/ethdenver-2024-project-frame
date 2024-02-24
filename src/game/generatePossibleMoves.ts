import { getReversedDisks } from "./getReversedDisks.ts";
import { Move, Point, State, TeamId } from "./types.ts";

export function generatePossibleMoves(
  state: State,
  cells: (TeamId | null)[][]
): Move[] {
  const result: Point[] = [];

  for (let x = 0; x < cells.length; x++) {
    for (let y = 0; y < cells[0].length; y++) {
      if (cells[y][x]) {
        continue;
      }

      const point = <Point>{ x, y };

      if (getReversedDisks(state, point, cells).length) {
        result.push(point);
      }
    }
  }

  return result.map((x) => [state.activeTeamId, x.x, x.y]);
}
