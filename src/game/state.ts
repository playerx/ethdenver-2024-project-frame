import { db } from "../db.ts";
import { analyzeWinner } from "./analyzeWinner.ts";
import { generatePossibleMoves } from "./generatePossibleMoves.ts";
import { getReversedDisks } from "./getReversedDisks.ts";
import { Action, GameMode, Move, State, TeamId } from "./types.ts";

export const getGameState = async (
  id: string,
  gameMode: GameMode,
  boardSize: number,
  dryRun?: boolean
) => {
  let state = dryRun ? null : await db.games.getById(id).then((x) => x?.state);

  if (!state) {
    state = {
      id,
      gameMode,
      boardSize,
      winnerTeamId: null,
      activeTeamId: "A",
      team: {
        A: {},
        B: {},
      },
      actions: [],
      cells: new Array(boardSize)
        .fill(0)
        .map(() => new Array(boardSize).fill(0).map(() => null)),
      nextPossibleMoves: [],
    };

    const center = Math.ceil(boardSize / 2);
    const defaultMoves: Move[] = [
      ["A", center - 1, center - 1],
      ["A", center - 1, center],
      ["B", center, center - 1],
      ["B", center, center],
    ];

    defaultMoves.forEach(([teamId, y, x]) => {
      state!.cells[y][x] = teamId;
    });

    state.nextPossibleMoves = generatePossibleMoves(state);
  }

  return state;
};

export const gameMove = async (
  state: State,
  action: Action,
  dryRun?: boolean
) => {
  let move: Move = null as any;

  // validate move, per mode the logic is different
  switch (state.gameMode) {
    case GameMode.OPEN:
      {
        const [fid, y, x] = action;

        let playerTeam: TeamId | null = null;
        // state.team.A[fid]
        //   ? "A"
        //   : state.team.B[fid]
        //   ? "B"
        //   : null;

        if (!playerTeam) {
          playerTeam = state.activeTeamId;

          // get username by fid
          const userData = await fetch(
            "https://fnames.farcaster.xyz/transfers?fid=" + fid
          ).then((x) => x.json());

          const userInfo = userData.transfers.sort(
            (a, b) => b.timestamp - a.timestamp
          )[0];

          const username = userInfo?.username ?? "User " + fid;

          state.team[state.activeTeamId][fid] = { username };
        }

        // if (playerTeam !== state.activeTeamId) {
        //   throw new Error(
        //     "It's your opponent's turn. Ask your friend to make a move."
        //   );
        // }

        move = [playerTeam, y, x];
      }
      break;
  }

  if (!move) {
    throw new Error("Invalid move");
  }

  {
    const [playerTeam, y, x] = move;
    state.cells[y][x] = playerTeam;

    const reversedDisks = getReversedDisks(state, { x, y });

    reversedDisks.forEach((x) => {
      state.cells[x.y][x.x] = playerTeam;
    });
  }

  state.actions.push(action);
  console.log("added action", state.id, state.actions.length);

  state.activeTeamId = state.activeTeamId === "A" ? "B" : "A";

  state.nextPossibleMoves = generatePossibleMoves(state);

  /**
   * If player don't have any move, switch to the next player
   */
  if (!state.nextPossibleMoves.length) {
    state.activeTeamId = state.activeTeamId === "A" ? "B" : "A";
    state.nextPossibleMoves = generatePossibleMoves(state);
  }

  const winner = analyzeWinner(state.cells);

  console.log("winner check", winner);

  if (winner) {
    state.winnerTeamId = winner;
    state.activeTeamId = "" as any;
  }

  if (!dryRun) {
    await db.games.updateOne(
      { id: state.id },
      { $set: { state } },
      { upsert: true }
    );
  }

  return { state, winner };
};

// const generateCellsBasedOnMoves = (state: State) => {
//   const cells: (TeamId | null)[][] = new Array(state.boardSize)
//     .fill(0)
//     .map(() => new Array(state.boardSize).fill(0).map(() => null));

//   state.cells.forEach(([teamId, y, x]) => {
//     cells[y][x] = teamId;
//   });

//   return cells;
// };
