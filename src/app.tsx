import { ImageResponse } from "npm:@vercel/og";
import { DRAW } from "./game/analyzeWinner.ts";
import { gameMove, getGameState } from "./game/state.ts";
import { Action, GameMode, State } from "./game/types.ts";
import { getFrameHtml } from "./helper/getFrameHtml.ts";
import { buildView } from "./view.tsx";

const ROUTE = new URLPattern({ pathname: "/:gameId{/:action}?" });

Deno.serve(async (req: Request) => {
  try {
    const url = req.url.endsWith("/")
      ? req.url.slice(0, req.url.length - 1)
      : req.url;

    const {
      gameId,
      action,
      gameMode,
      boardSize,
      showOnlyBoard,
      index,
      warningMessage,
      urlOrigin,
    } = parseParams(url);

    let state: State = await getGameState(gameId, gameMode, boardSize);

    console.log(state);
    console.log(
      gameId,
      action,
      gameMode,
      boardSize,
      showOnlyBoard,
      index,
      warningMessage
    );

    if (action === "view") {
      return new ImageResponse(
        buildView({
          challenger1Title: "@playerx",
          challenger2Title: "followers",
          bottomTitle: "Reversi",
          version: "v0.1.0",
          copyright: "",
          boardSize,
          showOnlyBoard,
          warningMessage,

          leftTeam: {
            name: "Blue Team",
            color: "#2196F3",
            moves: state.moves
              .filter((x) => x[0] === "A")
              .map((x) => [x[1], x[2]]),

            nextMovePreviews: state.nextPossibleMoves
              .filter((x) => x[0] === "A")
              .map((x) => [x[1], x[2]]),

            usernames: Object.values(state.team.A).map((x) => x.username),
          },

          rightTeam: {
            name: "Red Team",
            color: "#F44336",
            moves: state.moves
              .filter((x) => x[0] === "B")
              .map((x) => [x[1], x[2]]),

            nextMovePreviews: state.nextPossibleMoves
              .filter((x) => x[0] === "B")
              .map((x) => [x[1], x[2]]),

            usernames: Object.values(state.team.B).map((x) => x.username),
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
    }

    let errorMessage = "";
    let isFinished = false;
    let isDraw = false;

    try {
      if (action === "move") {
        if (state.actions.length !== index) {
          throw new Error(
            "Someone already made a move, now you see updated state."
          );
        }

        const postData = await req.json();
        const fid = postData?.untrustedData?.castId?.fid;
        if (!fid) {
          throw new Error("fid not found in request");
        }

        const inputText: string =
          postData?.untrustedData?.inputText?.toUpperCase();
        if (!inputText) {
          throw new Error("Please type the move: A, B, etc.");
        }

        const moveIndex = inputText.charCodeAt(0) - "A".charCodeAt(0);
        const move = state.nextPossibleMoves[moveIndex];
        if (!move) {
          throw new Error("Invalid move");
        }

        const messageBytes = postData?.trustedData?.messageBytes;
        if (!messageBytes) {
          throw new Error("Invalid messageBytes");
        }

        // TODO: validate messageBytes and fid here as well

        const action: Action = [fid, move[1], move[2], messageBytes];

        console.log("move", action);

        const { state: newState, winner } = await gameMove(
          gameId,
          action,
          gameMode,
          boardSize
        );

        console.log(newState);

        if (winner) {
          isFinished = true;
          isDraw = winner === DRAW;
        }

        state = newState;
      }
    } catch (err) {
      errorMessage = err.message;
    }

    const postUrl = `${urlOrigin}/move?index=${state.actions.length}`;
    const imageUrl = `${urlOrigin}/view?message=${errorMessage}&index=${
      state.actions.length
    }&time=${Date.now()}`;

    const html = getFrameHtml(
      {
        ogImage: `${imageUrl}&wide`,
        image: imageUrl,
        imageAspectRatio: "1:1",
        postUrl: postUrl,
        inputText: "Your Move, type: A, B, C, etc.",
        buttons: isFinished
          ? [
              {
                label: "Play Again",
                action: "link",
                target:
                  "https://warpcast.com/~/compose?text=Hello%20world!&embeds[]=https://farcaster.xyz",
              },
              {
                label: "Claim",
                action: "link",
                target: `https://mint.me/${gameId}`,
              },
            ]
          : [
              { label: "Move", action: "post" },
              { label: "Refresh", action: "post" },
            ],
        version: "vNext",
      },
      {
        title: "Reversi Game",
        og: { title: "Reversi Game" },
        htmlBody: `
          <img src="${imageUrl}&wide" />
        `,
      }
    );

    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html",
      },
    });
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }
});

const parseParams = (url: string) => {
  const requestData = ROUTE.exec(url);
  if (!requestData) {
    throw new Error("Please provide gameId in the url");
  }

  const theUrl = new URL(url);

  const gameId = requestData.pathname.groups.gameId!;
  const action = requestData.pathname.groups.action!;

  let gameMode = theUrl.searchParams.get("mode")! as GameMode;
  if (!GameMode[gameMode]) {
    gameMode = GameMode.OPEN;
  }

  let boardSize = 8;
  const boardSizeString = theUrl.searchParams.get("boardSize")!;
  if (boardSize) {
    const boardSizeInt = parseInt(boardSizeString, 10);
    if (boardSizeInt && boardSizeInt >= 4 && boardSizeInt <= 10) {
      boardSize = boardSizeInt;
    }
  }

  const showOnlyBoard = !theUrl.searchParams.has("wide");
  const index = +(theUrl.searchParams.get("index") ?? "0");

  const warningMessage = theUrl.searchParams.get("message") ?? "";

  return {
    gameId,
    action,
    gameMode,
    boardSize,
    showOnlyBoard,
    index,
    warningMessage,
    urlOrigin: theUrl.origin,
  };
};
