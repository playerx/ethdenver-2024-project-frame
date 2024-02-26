import { getGameState } from "../game/state.ts";
import { buildViewAction } from "../helper/buildViewAction.ts";
import { parseQueryParams } from "../helper/parseParams.ts";

export const viewApi = async (req: Request) => {
  const url = new URL(req.url);
  const { viewerFid, gameMode, boardSize, showOnlyBoard, warningMessage } =
    parseQueryParams(url);

  const gameId = url.pathname.replace("/view/", "").replace(".png", "");
  if (!gameId) {
    return new Response("Please provide gameId");
  }

  const state = await getGameState(gameId, gameMode, boardSize);

  return buildViewAction({
    state,
    viewerFid,
    boardSize,
    showOnlyBoard,
    warningMessage,
  });
};
