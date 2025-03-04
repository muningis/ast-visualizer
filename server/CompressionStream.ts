import zlib from "node:zlib";

export class CompressionStream {
  readable: ReadableStream;
  writable: WritableStream;

  constructor() {
    const gzip = zlib.createGzip();

    this.readable = new ReadableStream({
      start(controller) {
        gzip.on("data", (chunk: Uint8Array) => {
          controller.enqueue(chunk);
        });
        gzip.once("end", () => {
          controller.close();
        });
      },
    });

    this.writable = new WritableStream({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
      write: (chunk: Uint8Array) => gzip.write(chunk) as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
      close: () => gzip.end() as any,
    });
  }
}
