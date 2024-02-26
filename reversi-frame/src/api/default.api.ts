import { ObjectId, encodeBase64 } from "../deps.ts";
import { getFrameHtml } from "../helper/getFrameHtml.ts";

const indexHtml = await Deno.readTextFile("./public/index.html").catch(
  () => "Hello. `public/index.html` file does not exist"
);

const promoImage = await Deno.readFileSync("./public/promo.png");

export const defaultApi = (req: Request) => {
  let url = req.url;
  const imageUrl = "data:image/png;base64," + encodeBase64(promoImage);

  if (url.startsWith("http://")) {
    url = url.replace("http://", "https://");
  }

  const newGameUrl =
    "https://reversi-frame.jok.io/play/" + new ObjectId().toHexString();

  const fullPlayUrl =
    "https://warpcast.com/~/compose?text=Lets%20%23play%20%23reversi&embeds[]=" +
    encodeURIComponent(newGameUrl);

  if (req.method === "POST") {
    return Response.redirect(fullPlayUrl, 302);
  }

  const htmlBody = indexHtml.replaceAll("{frameUrl}", fullPlayUrl);

  const html = getFrameHtml(
    {
      ogImage: imageUrl,
      image: imageUrl,
      imageAspectRatio: "1:1",
      postUrl: url,
      inputText: "Multiplayer Game | Play in Frame",
      buttons: [{ label: "🚀 Start a new game", action: "post_redirect" }],
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
