import { ObjectId } from "../deps.ts";
import { getFrameHtml } from "../helper/getFrameHtml.ts";

const indexHtml = await Deno.readTextFile("./public/index.html").catch(
  () => "Hello. `public/index.html` file does not exist"
);

export const defaultApi = (req: Request) => {
  let url = req.url;
  const imageUrl = "https://reversi-frame.jok.io/public/promo.png";

  if (url.startsWith("http://")) {
    url = url.replace("http://", "https://");
  }

  const playUrl =
    "https://reversi-frame.jok.io/play/" + new ObjectId().toHexString();

  if (req.method === "post") {
    return Response.redirect(playUrl, 302);
  }

  const htmlBody = indexHtml.replaceAll("{frameUrl}", playUrl);

  const html = getFrameHtml(
    {
      ogImage: imageUrl,
      image: imageUrl,
      imageAspectRatio: "1:1",
      postUrl: url,
      inputText: "Reversi Game - The first realtime game in Frame!",
      buttons: [{ label: "Start a new game", action: "post_redirect" }],
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
