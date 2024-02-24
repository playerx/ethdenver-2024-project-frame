import { analyzeWinner } from "./analyzeWinner.ts";
import { generatePossibleMoves } from "./generatePossibleMoves.ts";
import { Action, GameMode, Move, State, TeamId } from "./types.ts";

const DEFAULT_MOVES: Move[] = [
  ["A", 4, 4],
  ["A", 4, 5],
  ["B", 5, 4],
  ["B", 5, 5],
];

const states = new Map<string, State>();

export const getGameState = (
  id: string,
  gameMode: GameMode,
  boardSize: number
) => {
  let state = states.get(id);
  if (!state) {
    state = {
      id,
      gameMode,
      boardSize,
      activeTeamId: "A",
      team: {
        A: [],
        B: [],
      },
      actions: [],
      moves: DEFAULT_MOVES,
      nextPossibleMoves: [],
    };

    state.nextPossibleMoves = generatePossibleMoves(
      state,
      generateCellsBasedOnMoves(state)
    );
  }

  return state;
};

export const gameMove = (
  id: string,
  action: Action,
  gameMode: GameMode,
  boardSize: number
) => {
  const state = getGameState(id, gameMode, boardSize);

  let move: Move = null as any;

  // validate move, per mode the logic is different
  switch (state.gameMode) {
    case GameMode.OPEN:
      {
        const [fid, y, x] = action;

        let playerTeam = state.team.A[fid]
          ? "A"
          : state.team.B[fid]
          ? "B"
          : null;

        if (!playerTeam) {
          playerTeam = state.activeTeamId;

          // TODO: get username by fid
          state.team[state.activeTeamId][fid] = { username: fid.toString() };
        }

        if (playerTeam !== state.activeTeamId) {
          throw new Error("It's your opponent's turn");
        }

        move = [playerTeam, y, x];
      }
      break;
  }

  if (!move) {
    throw new Error("Invalid move");
  }

  state.moves.push(move);

  const cells = generateCellsBasedOnMoves(state);

  state.nextPossibleMoves = generatePossibleMoves(state, cells);

  const winner = analyzeWinner(cells);

  return winner;
};

const generateCellsBasedOnMoves = (state: State) => {
  const cells: (TeamId | null)[][] = new Array(state.boardSize)
    .fill(0)
    .map(() => new Array(state.boardSize).fill(0).map(() => null));

  state.moves.forEach(([teamId, y, x]) => {
    cells[y][x] = teamId;
  });

  return cells;
};
