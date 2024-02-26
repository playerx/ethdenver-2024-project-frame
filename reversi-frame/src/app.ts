import { viewApi } from "./api/view.api.ts";
import { staticApi } from "./api/static.api.ts";
import { playApi } from "./api/play.api.ts";
import { moveApi } from "./api/move.api.ts";
import { defaultApi } from "./api/default.api.ts";

Deno.serve((req: Request) => {
  try {
    const theUrl = new URL(req.url);
    const pathname = theUrl.pathname;

    if (pathname.startsWith("/public")) {
      return staticApi(req);
    }

    if (pathname.startsWith("/view")) {
      return viewApi(req);
    }

    if (pathname.startsWith("/move")) {
      return moveApi(req);
    }

    if (pathname.startsWith("/play")) {
      return playApi(req);
    }

    return defaultApi(req);
  } catch (err) {
    console.log(err);
    return new Response(err.message, { status: 400 });
  }
});
