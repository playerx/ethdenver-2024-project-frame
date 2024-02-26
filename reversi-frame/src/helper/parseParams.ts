import { GameMode } from "../game/types.ts";

export const parseQueryParams = (url: URL) => {
  let gameMode = url.searchParams.get("mode")! as any;
  if (!GameMode[gameMode]) {
    gameMode = GameMode.OPEN;
  }

  let boardSize = 8;
  const boardSizeString = url.searchParams.get("boardSize")!;
  if (boardSize) {
    const boardSizeInt = parseInt(boardSizeString, 10);
    if (boardSizeInt && boardSizeInt >= 4 && boardSizeInt <= 10) {
      boardSize = boardSizeInt;
    }
  }

  const showOnlyBoard = !url.searchParams.has("wide");
  const index = +(url.searchParams.get("index") ?? "0");

  const warningMessage = url.searchParams.get("message") ?? "";

  const viewerFid = url.searchParams.get("viewerFid") ?? "";

  const debug = !url.searchParams.has("debug");

  return {
    gameMode,
    boardSize,
    showOnlyBoard,
    index,
    warningMessage,
    urlOrigin: url.origin,
    viewerFid,
    debug,
  };
};
