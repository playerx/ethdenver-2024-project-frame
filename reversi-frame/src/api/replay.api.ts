import { encodeBase64 } from "../deps.ts";
import { getGameState } from "../game/state.ts";
import { parseQueryParams } from "../helper/parseParams.ts";
import { replayImages } from "../helper/replayImages.ts";

const GIF_AUTH_TOKEN = Deno.env.get("GIF_AUTH_TOKEN");

export const replayApi = async (req: Request) => {
  const url = new URL(req.url);
  const { gameMode, boardSize, debug } = parseQueryParams(url);

  const gameId = url.pathname.replace("/replay/", "").replace(".gif", "");
  if (!gameId) {
    return new Response("Please provide gameId");
  }

  const state = await getGameState(gameId, gameMode, boardSize);

  const images = await replayImages(state, debug);

  const layers = images.map((x) => encodeBase64(x.buffer));

  const gifImage = await fetch("https://gif-builder.jok.io", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + GIF_AUTH_TOKEN,
    },
    body: JSON.stringify({
      width: 1200,
      height: 630,
      images: layers,
    }),
  });

  const blob = await gifImage.blob();

  return new Response(blob, {
    headers: { "Content-Type": "image/gif" },
  });
};
