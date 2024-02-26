export const staticApi = async (req: Request) => {
  const url = new URL(req.url);
  const filepath = decodeURIComponent(url.pathname);

  // Try opening the file
  let file: Deno.FsFile;
  try {
    file = await Deno.open("." + filepath, { read: true });
  } catch {
    // If the file cannot be opened, return a "404 Not Found" response
    return new Response("404 Not Found", { status: 404 });
  }

  return new Response(file.readable);
};
