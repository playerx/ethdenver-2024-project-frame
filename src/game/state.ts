import { db } from "../db.ts";
import { analyzeWinner } from "./analyzeWinner.ts";
import { generatePossibleMoves } from "./generatePossibleMoves.ts";
import { Action, GameMode, Move, State, TeamId } from "./types.ts";

const DEFAULT_MOVES: Move[] = [
  ["A", 3, 3],
  ["A", 3, 4],
  ["B", 4, 3],
  ["B", 4, 4],
];

export const getGameState = async (
  id: string,
  gameMode: GameMode,
  boardSize: number
) => {
  let state = await db.games.getById(id).then((x) => x?.state);
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

export const gameMove = async (
  id: string,
  action: Action,
  gameMode: GameMode,
  boardSize: number
) => {
  const state: State = await getGameState(id, gameMode, boardSize);

  let move: Move = null as any;

  // validate move, per mode the logic is different
  switch (state.gameMode) {
    case GameMode.OPEN:
      {
        const [fid, y, x] = action;

        let playerTeam: TeamId | null = state.team.A[fid.toString()]
          ? "A"
          : state.team.B[fid.toString()]
          ? "B"
          : null;

        if (!playerTeam) {
          playerTeam = state.activeTeamId;

          // TODO: get username by fid
          const userData = await fetch(
            "https://fnames.farcaster.xyz/transfers?fid=" + fid
          ).then((x) => x.json());

          const userInfo = userData.transfers.sort(
            (a, b) => b.timestamp - a.timestamp
          )[0];

          const username = userInfo?.username ?? "User " + fid;

          state.team[state.activeTeamId][fid.toString()] = { username };
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

  await db.games.updateOne({ id }, { $set: { state } });

  const winner = analyzeWinner(cells);

  return { state, winner };
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
