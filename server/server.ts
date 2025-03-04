import { serve } from "bun";
import { join } from "path";
import { CompressionStream } from "./CompressionStream";

const PORT = process.env.PORT || 3000;

const shouldCompress = (req: Request) => {
  const acceptEncoding = req.headers.get("Accept-Encoding");
  return acceptEncoding?.includes("gzip");
};

serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    let filePath = url.pathname;

    if (filePath === "/") filePath = "/index.html";
    const headers = new Headers();
    if (filePath.endsWith(".js") || filePath.endsWith(".css")) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    }

    const file = Bun.file(join(import.meta.dir, "../dist", filePath));

    if (!shouldCompress(req)) {
      return new Response(file.stream(), { headers });
    }

    headers.set("Content-Encoding", "gzip");
  
    const contentType = file.type;

    headers.set("Content-Type", contentType);

    const readable = file.stream();
    const compressed = readable.pipeThrough(new CompressionStream());

    return new Response(compressed, { headers });
  },
});