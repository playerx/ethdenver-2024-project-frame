import { encode as base64Encode } from "https://deno.land/std@0.166.0/encoding/base64.ts";
import { createCanvas } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
// import { createImageData } from "npm:canvas";
import GIFEncoder from "npm:gif-encoder-2";
import GIF from "npm:gif.js";

console.log(GIF);

export const buildGif = async (width, height, images: ArrayBuffer[]) => {
  // console.log("t", images[0].byteLength, 4 * width * height, width * height);

  const encoder = new GIFEncoder(
    width,
    height,
    undefined,
    false,
    images.length
  );

  encoder.on("readable", () => encoder.read());
  encoder.setDelay(100);
  encoder.setRepeat(3);
  encoder.setFrameRate(10);
  encoder.setQuality(10);
  encoder.start();

  // Render each frame and add it to the encoder
  images.forEach((x, i) => {
    // Create the frame's canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Create image data from the frame's data and put it on the canvas
    const data = new ImageData(new Uint8ClampedArray(x), width, height);
    ctx.putImageData(data, 0, 0);

    encoder.addFrame(ctx);
  });

  // Finish encoding and return the result
  encoder.finish();

  const buff = encoder.out.getData();

  const base64 = base64Encode(buff);

  return base64;

  // return new Promise((resolve) => {
  //   // Create a new GIF instance
  //   const gif = new GIF.GIFEncoder({
  //     workers: 2,
  //     quality: 10,
  //   });

  //   images.forEach((x) => {
  //     const imageData = new ImageData(new Uint8ClampedArray(x), width, height);

  //     // Create a canvas
  //     const canvas = createCanvas(width, height);
  //     const ctx = canvas.getContext("2d");
  //     canvas.width = imageData.width;
  //     canvas.height = imageData.height;

  //     // Draw the image data onto the canvas
  //     ctx.putImageData(imageData, 0, 0);

  //     // Add the canvas frames to the GIF
  //     gif.addFrame(canvas, { copy: true, delay: 200 });
  //   });

  //   // When all frames have been added, create the GIF
  //   gif.on("finished", function (blob) {
  //     // You can now do something with the generated GIF blob
  //     // For example, you can create a URL and display it
  //     const url = URL.createObjectURL(blob);

  //     resolve(url);
  //     // const img = document.createElement("img");
  //     // img.src = url;
  //     // document.body.appendChild(img);
  //   });

  //   // Start encoding the GIF
  //   gif.render();
  // });

  // const output = await encode({
  //   width,
  //   height,
  //   debug: true,
  //   frames: images.map((x) => {
  //     const imageData = new ImageData(new Uint8ClampedArray(x), width, height);

  //     // Create a canvas
  //     const canvas = createCanvas(width, height);
  //     const ctx = canvas.getContext("2d");
  //     canvas.width = imageData.width;
  //     canvas.height = imageData.height;

  //     // Draw the image data onto the canvas
  //     ctx.putImageData(imageData, 0, 0);

  //     return {
  //       // data: new Blob([x], { type: "image/png" }),
  //       data: imageData,
  //       delay: 100,
  //     };
  //   }),
  // });

  // console.log("output", width, height, images.length);
  // const blob = new Blob([output], { type: "image/gif" });
  // const buff = await blob.arrayBuffer();

  // const canvas = createCanvas(width, height);
  // const ctx = canvas.getContext("2d");

  // const encoder = new GIFEncoder(width, height);
  // encoder.createReadStream();
  // encoder.start();
  // encoder.setRepeat(0);
  // encoder.setDelay(1000);
  // encoder.setQuality(30);

  // for (const image of images) {
  //   ctx.drawImage(
  //     await loadImage(new Uint8Array(image)),
  //     0,
  //     0,
  //     image.width,
  //     image.height,
  //     0,
  //     0,
  //     canvas.width,
  //     canvas.height
  //   );
  //   encoder.addFrame(ctx);
  // }

  // encoder.finish();

  // const buf = encoder.out.getData();

  // console.log(output);

  // console.log(base64?.length);

  // const gif = new GIF({
  //   workers: 2,
  //   quality: 10
  // });

  // // add an image element
  // gif.addFrame(imageElement);

  // // or a canvas element
  // gif.addFrame(canvasElement, {delay: 200});

  // // or copy the pixels from a canvas context
  // gif.addFrame(ctx, {copy: true});

  // gif.on('finished', function(blob) {
  //   window.open(URL.createObjectURL(blob));
  // });

  // gif.render();

  // const base64 = base64Encode(output);

  // return base64;
};
