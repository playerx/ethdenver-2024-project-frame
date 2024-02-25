import { encode as base64Encode } from "https://deno.land/std@0.166.0/encoding/base64.ts";
import { gameMove, getGameState } from "../game/state.ts";
import { Action, State } from "../game/types.ts";
import { buildViewAction } from "./buildViewAction.ts";

export const replayImages = async (state: State, debug: boolean) => {
  const prevActions: Action[] = [];
  console.log("state.actions", state.actions.length);
  const res: string[] = [];

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

    const base64 = base64Encode(await image.arrayBuffer());

    res.push(base64);
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

    const base64 = base64Encode(await image.arrayBuffer());

    res.push(base64);
  }

  return res;
};
