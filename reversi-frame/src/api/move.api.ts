import { gameMove, getGameState } from "../game/state.ts";
import { Action } from "../game/types.ts";
import { parseQueryParams } from "../helper/parseParams.ts";
import { renderFrame } from "./play.api.ts";

export const moveApi = async (req: Request) => {
  const url = new URL(req.url);

  const gameId = url.pathname.replace("/move/", "");
  if (!gameId) {
    return new Response("Please provide gameId");
  }

  const { viewerFid, gameMode, index, urlOrigin, boardSize, debug } =
    parseQueryParams(url);

  let state = await getGameState(gameId, gameMode, boardSize);

  let newViewerFid = viewerFid;
  let errorMessage = "";

  try {
    if (state.actions.length !== index) {
      throw new Error(
        "Someone already made a move, now you see updated state."
      );
    }

    const postData = await req.json();

    const buttonIndex = postData?.untrustedData?.buttonIndex;
    console.log("buttonIndex", buttonIndex);

    /**
     * Move button click
     */
    if (buttonIndex === 1) {
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

      newViewerFid = fid;
      // TODO: validate messageBytes and fid here as well

      const action: Action = [fid, move[1], move[2], messageBytes];

      const { state: newState } = await gameMove(
        state,
        action,
        undefined,
        debug
      );

      state = newState;
    }
  } catch (err) {
    errorMessage = err.message;
  }

  return renderFrame({
    state,
    errorMessage,
    viewerFid: newViewerFid,
    urlOrigin,
  });
};
