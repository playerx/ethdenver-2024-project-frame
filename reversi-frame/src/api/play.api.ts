import { getGameState } from "../game/state.ts";
import { State } from "../game/types.ts";
import { getFrameHtml } from "../helper/getFrameHtml.ts";
import { parseQueryParams } from "../helper/parseParams.ts";

const playHtml = await Deno.readTextFile("./public/play.html").catch(
  () => "Hello. `public/index.html` file does not exist"
);

export const playApi = async (req: Request) => {
  const url = new URL(req.url);

  const gameId = url.pathname.replace("/play/", "");
  if (!gameId) {
    return new Response("Please provide gameId");
  }

  const { viewerFid, gameMode, urlOrigin, boardSize } = parseQueryParams(url);

  const state = await getGameState(gameId, gameMode, boardSize);

  return renderFrame({
    state,
    urlOrigin,
    errorMessage: "",
    viewerFid,
  });
};

type RenderProps = {
  state: State;
  urlOrigin: string;
  viewerFid: string;
  errorMessage: string;
};

export const renderFrame = ({
  state,
  urlOrigin: urlOriginParam,
  viewerFid,
  errorMessage,
}: RenderProps) => {
  const gameId = state.id;
  const isFinished = !!state.winnerTeamId;

  let urlOrigin = urlOriginParam.endsWith("/")
    ? urlOriginParam.slice(0, urlOriginParam.length - 1)
    : urlOriginParam;

  if (urlOrigin.startsWith("http://")) {
    urlOrigin = urlOrigin.replace("http://", "https://");
  }

  const postUrl = `${urlOrigin}/move/${gameId}?${new URLSearchParams({
    index: state.actions.length.toString(),
    viewerFid: viewerFid.toString(),
    gameMode: state.gameMode.toString(),
    boardSize: state.boardSize.toString(),
  })}`;

  const playUrl = `${urlOrigin}/play/${gameId}?${new URLSearchParams({
    index: state.actions.length.toString(),
  })}`;

  const imageUrl = `${urlOrigin}/view/${gameId}.png?${new URLSearchParams({
    message: errorMessage,
    index: state.actions.length.toString(),
    time: Date.now().toString(),
    viewerFid: viewerFid.toString(),
    gameMode: state.gameMode.toString(),
    boardSize: state.boardSize.toString(),
    isDraw: "1",
  }).toString()}`;

  const replayUrl = `${urlOrigin}/replay/${gameId}.gif`;

  const htmlBody = playHtml
    .replaceAll("{viewUrl}", isFinished ? replayUrl : imageUrl + "&wide")
    .replaceAll("{frameUrl}", playUrl)
    .replaceAll("{buttonText}", isFinished ? "Share" : "Share & Play")
    .replaceAll(
      "{freeText}",
      isFinished
        ? "Game Finished" +
            (state.winnerTeamId === "A"
              ? ". 👑 Winner: Blue Team"
              : state.winnerTeamId === "B"
              ? ". 👑 Winner: Red Team"
              : "Draw 🤝")
        : ""
    );

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
              target: urlOrigin,
            },
            {
              label: "Mint",
              action: "link",
              target: playUrl,
            },
          ]
        : [
            { label: "Move", action: "post" },
            {
              label: "Refresh",
              action: "post",
              target: playUrl + `&time= ${Date.now().toString()}`,
            },
          ],
      version: "vNext",
    },
    {
      title: "Reversi Game",
      og: { title: "Reversi Game" },
      htmlBody,
    }
  );

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
};
