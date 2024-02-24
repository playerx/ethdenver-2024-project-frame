import { ImageResponse } from "npm:@vercel/og";
import { getFrameHtml } from "./helper/getFrameHtml.ts";
import { buildView } from "./view.tsx";

Deno.serve((req: Request) => {
  const url = new URL(req.url);
  if (url.pathname === "/view") {
    const showOnlyBoard = !url.searchParams.has("wide");

    return new ImageResponse(
      buildView({
        challenger1Title: "@playerx",
        challenger2Title: "followers",
        bottomTitle: "Reversi",
        version: "v0.1.0",
        copyright: "",
        showOnlyBoard,

        leftTeam: {
          name: "Blue Team",
          color: "#2196F3",
          moves: [
            [4, 4],
            [4, 5],
          ],
          nextMovePreviews: [
            [6, 3],
            [6, 4],
            [6, 5],
            [6, 6],
          ],
          usernames: ["@playerx"],
        },

        rightTeam: {
          name: "Red Team",
          color: "#F44336",
          moves: [
            [5, 4],
            [5, 5],
          ],
          nextMovePreviews: [],
          usernames: ["@ez", "@someone.eth", "@rtr.eth"],
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

  const html = getFrameHtml(
    {
      image: req.url + "view",
      imageAspectRatio: "1:1",
      ogImage: req.url + "view?wide",
      postUrl: req.url,
      inputText: "Your Move, type: A, B, C, etc.",
      buttons: [{ label: "Move", action: "post" }],
      version: "vNext",
    },
    {
      title: "Reversi Game",
      og: { title: "Reversi Game" },
      htmlBody: `
        <img src="${req.url + "view?wide"}" />
      `,
    }
  );

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
});
