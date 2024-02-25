import { createCanvas } from "npm:canvas";
import GIFEncoder from "npm:gifencoder";

export const buildGif = (width, height, images) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const encoder = new GIFEncoder(width, height);
  encoder.createReadStream();
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(1000);
  encoder.setQuality(30);

  for (const image of images) {
    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
    encoder.addFrame(ctx);
  }

  encoder.finish();
};
