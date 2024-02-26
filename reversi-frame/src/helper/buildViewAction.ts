import { ImageResponse } from "../deps.ts";
import { GameMode, State } from "../game/types.ts";
import { buildView } from "../view.tsx";

export const buildViewAction = ({
  state,
  viewerFid,
  boardSize,
  showOnlyBoard,
  warningMessage,
  isReplay,
}: {
  state: State;
  viewerFid: string;
  boardSize: number;
  showOnlyBoard: boolean;
  warningMessage: string;
  isReplay?: boolean;
}) => {
  const teamOwnedCells = state.cells
    .map((a, y) =>
      a.map((teamId, x) => ({
        x,
        y,
        teamId,
      }))
    )
    .flat()
    .filter((x) => x.teamId);

  const teamAPoints = teamOwnedCells.filter((x) => x.teamId === "A").length;
  const teamBPoints = teamOwnedCells.filter((x) => x.teamId === "B").length;
  const viewerUserNameInTeamA = state.team.A[+viewerFid]?.username;
  const viewerUserNameInTeamB = state.team.B[+viewerFid]?.username;

  let lastPlayerUsername = state.lastPlayerFid
    ? state.team.A[state.lastPlayerFid]?.username ||
      state.team.B[state.lastPlayerFid]?.username
    : "";

  if (lastPlayerUsername) {
    lastPlayerUsername = "@" + lastPlayerUsername;
  }

  return new ImageResponse(
    buildView({
      challenger1Title:
        state.gameMode === GameMode.OPEN
          ? (state.winnerTeamId === "A" ? "👑 " : "") +
            (state.activeTeamId === "A" && !isReplay ? "🧐 " : "") +
            (viewerUserNameInTeamA || "Anyone")
          : "@playerx",

      challenger2Title:
        state.gameMode === GameMode.OPEN
          ? (state.winnerTeamId === "B" ? " 👑" : "") +
            (viewerUserNameInTeamB || "Anyone") +
            (state.activeTeamId === "B" && !isReplay ? " 🧐" : "")
          : "followers",

      bottomTitle: "Reversi",
      version: "v0.1.0",
      copyright: state.gameHashtag ? `Game ${state.gameHashtag}` : "New Game",
      boardSize,
      showOnlyBoard,
      warningMessage,
      lastMove: state.lastMove
        ? [state.lastMove[2], state.lastMove[1]]
        : undefined,

      lastPlayerUsername,

      leftTeam: {
        name: "Blue Team",
        color: "#2196F3",
        points: teamAPoints,
        moves: teamOwnedCells
          .filter((c) => c.teamId === "A")
          .map((c) => [c.y, c.x]),

        nextMovePreviews: state.nextPossibleMoves
          .filter((x) => x[0] === "A")
          .map((x) => [x[1], x[2]]),

        usernames: Object.values(state.team.A).map((x) => `@${x.username}`),
      },

      rightTeam: {
        name: "Red Team",
        color: "#F44336",
        points: teamBPoints,
        moves: teamOwnedCells
          .filter((c) => c.teamId === "B")
          .map((c) => [c.y, c.x]),

        nextMovePreviews: state.nextPossibleMoves
          .filter((x) => x[0] === "B")
          .map((x) => [x[1], x[2]]),

        usernames: Object.values(state.team.B).map((x) => `@${x.username}`),
      },
    }),
    {
      width: showOnlyBoard ? 630 : 1200,
      height: 630,
      headers: {
        "Cache-Control": "no-cache",
      },
    }
  );
};
