import { encodeBase64 } from "../deps.ts";
import { gameMove, getGameState } from "../game/state.ts";
import { Action, State } from "../game/types.ts";
import { buildViewAction } from "./buildViewAction.ts";

export const replayImages = async (state: State, debug: boolean) => {
  const prevActions: Action[] = [];
  const res: { buffer: ArrayBuffer; base64: string }[] = [];

  // initial state
  {
    const s = await getGameState(
      state.id,
      state.gameMode,
      state.boardSize,
      true
    );

    const image = buildViewAction({
      state: s,
      viewerFid: "",
      boardSize: s.boardSize,
      showOnlyBoard: false,
      warningMessage: "",
      isReplay: true,
    });

    const buffer = await image.arrayBuffer();
    const base64 = encodeBase64(buffer);

    res.push({
      buffer,
      base64,
    });
  }

  for (const action of state.actions) {
    prevActions.push(action);

    let s = await getGameState(state.id, state.gameMode, state.boardSize, true);

    for (const a of prevActions) {
      const { state: nextState } = await gameMove(s, a, true, debug);
      s = nextState;
    }

    const image = buildViewAction({
      state: s,
      viewerFid: "",
      boardSize: s.boardSize,
      showOnlyBoard: false,
      warningMessage: "",
    });

    const buffer = await image.arrayBuffer();
    const base64 = encodeBase64(buffer);

    res.push({ buffer, base64 });
  }

  return res;
};
