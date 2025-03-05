import { BunFile, file, serve } from "bun";
import { join } from "path";
import { CompressionStream } from "./CompressionStream";

const PORT = process.env.PORT || 3001;

const shouldCompress = (req: Request) => {
  const acceptEncoding = req.headers.get("Accept-Encoding");
  return acceptEncoding?.includes("gzip");
};

const CACHE_CONTROL = "public, max-age=31536000, immutable";
const CACHE_EXTENSIONS = [".js", ".css", ".svg"];

serve({
  port: PORT,
  routes: {
    "/api/health": new Response("OK", { headers: { "Content-Type": "text/plain" } }),
  },
  fetch(req) {
    const url = new URL(req.url);
    let filePath = url.pathname;

    if (filePath === "/") filePath = "/index.html";
    const headers = new Headers();
    if (filePath.endsWith(".js") || filePath.endsWith(".css") || filePath.endsWith(".svg")) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    }

    try {
      const file = Bun.file(join(import.meta.dir, "../dist", filePath));
      if (!shouldCompress(req)) {
        return new Response(file.stream(), { headers });
      }
  
      headers.set("Content-Encoding", "gzip");
      headers.set("Content-Type", file.type);
  
      const readable = file.stream();
      const compressed = readable.pipeThrough(new CompressionStream());
  
      return new Response(compressed, { headers });
    } catch (e) {
      return new Response("Not found", { status: 404 });
    }
  },
})
