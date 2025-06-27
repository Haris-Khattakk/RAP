// const nsfw = require("nsfwjs");
// const tf = require("@tensorflow/tfjs");
// const fs = require("fs");
// const path = require("path");
// const { createCanvas, loadImage } = require("canvas");
// const sharp = require("sharp");
// const { execSync } = require("child_process");
// const mime = require("mime-types");
// const FileType = require('file-type')
// const { v4: uuidv4 } = require("uuid");
// const { getVideoDurationInSeconds } = require("get-video-duration");

// async function DetectNSFW(file) {
//   const type = await FileType.fromBuffer(file);
//   const mimeType = type.mime;

//   if (mimeType && mimeType.startsWith("image/")) {
//     return await detectImageNSFW(file);
//   } else if (mimeType && mimeType.startsWith("video/")) {
//     return await detectVideoNSFW(file);
//   } else {
//     throw new Error("Unsupported file type");
//   }
// }


// async function detectImageNSFW(imagePath) {
//   const pngBuffer = await sharp(imagePath).png().toBuffer();
//   const image = await loadImage(pngBuffer);

//   const canvas = createCanvas(image.width, image.height);
//   const ctx = canvas.getContext("2d");
//   ctx.drawImage(image, 0, 0);

//   const imageTensor = tf.browser.fromPixels(canvas);
//   const model = await nsfw.load();
//   const predictions = await model.classify(imageTensor);
//   imageTensor.dispose();
//   // console.log(predictions)
//   const isNSFW = predictions.some(
//     (p) => ["Porn", "Sexy", "Hentai"].includes(p.className) && p.probability >= 0.3
//   );

//   return isNSFW;
// }


// async function detectVideoNSFW(videoBuffer) {
//   const tempId = uuidv4();
//   const baseTempDir = path.resolve(__dirname, "../temps");
//   const tempDir = path.join(baseTempDir, `video-nsfw-${tempId}`);
//   const tempVideoPath = path.join(tempDir, "temp_video.mp4");

//   const frameDir = path.join(tempDir, "frames");


//   fs.mkdirSync(frameDir, { recursive: true });

//   // Write buffer to temp video file
//   fs.mkdirSync(tempDir, { recursive: true });
//   fs.writeFileSync(tempVideoPath, videoBuffer);
//   const duration = await getVideoDurationInSeconds(tempVideoPath);
//   // console.log(duration);

//   const timestamps = Array.from({ length: 2 }, () =>
//     Math.floor(Math.random() * duration)
//   );

//   const framePaths = [];

//   for (let i = 0; i < timestamps.length; i++) {
//     const time = timestamps[i];
//     const outputPath = `${frameDir}/frame_${i.toString().padStart(3, '0')}.png`;

//     execSync(
//       `ffmpeg -ss ${time} -i "${tempVideoPath}" -frames:v 1 -vf scale=224:224 ${outputPath} -hide_banner -loglevel error`
//     );

//     framePaths.push(outputPath);
//   }

//   let isNSFW = false;

//   for (const frame of framePaths) {
//     const frameBuffer = fs.readFileSync(frame);
//     isNSFW = await detectImageNSFW(frameBuffer);
//     if (isNSFW) break;
//   }

//   // Cleanup
//   fs.rmSync(tempDir, { recursive: true, force: true });
//   return isNSFW;
// }


// module.exports = DetectNSFW;


// Faster and more efficient NSFW detection
const nsfw = require("nsfwjs");
const tf = require("@tensorflow/tfjs-node"); 
const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const sharp = require("sharp");
const { execSync } = require("child_process");
const FileType = require("file-type");
const { v4: uuidv4 } = require("uuid");
const { getVideoDurationInSeconds } = require("get-video-duration");

let model = null;

// Preload the model at server startup
async function loadModel() {
  if (!model) {
    model = await nsfw.load();
    // Warm up with dummy tensor
    const dummy = tf.zeros([224, 224, 3]);
    await model.classify(dummy);
    dummy.dispose();
  }
}
loadModel();

async function DetectNSFW(file) {
  const type = await FileType.fromBuffer(file);
  if (!type?.mime) throw new Error("Could not determine MIME type");

  if (type.mime.startsWith("image/")) {
    return await detectImageNSFW(file);
  } else if (type.mime.startsWith("video/")) {
    return await detectVideoNSFW(file);
  } else {
    throw new Error("Unsupported file type");
  }
}

async function detectImageNSFW(imageBuffer) {
  const pngBuffer = await sharp(imageBuffer).resize(224, 224).png().toBuffer();
  const image = await loadImage(pngBuffer);

  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  const imageTensor = tf.browser.fromPixels(canvas);
  const predictions = await model.classify(imageTensor);
  imageTensor.dispose();

  return predictions.some(
    (p) => ["Porn", "Sexy", "Hentai"].includes(p.className) && p.probability >= 0.3
  );
}

async function detectVideoNSFW(videoBuffer) {
  const tempId = uuidv4();
  const baseTempDir = path.resolve(__dirname, "../temps");
  const tempDir = path.join(baseTempDir, `video-nsfw-${tempId}`);
  const tempVideoPath = path.join(tempDir, "video.mp4");
  const frameDir = path.join(tempDir, "frames");

  fs.mkdirSync(frameDir, { recursive: true });
  fs.writeFileSync(tempVideoPath, videoBuffer);

  const duration = await getVideoDurationInSeconds(tempVideoPath);
  const timestamps = Array.from({ length: 3 }, () => Math.floor(Math.random() * duration));

  const framePaths = timestamps.map((time, idx) => {
    const output = path.join(frameDir, `frame_${idx}.png`);
    execSync(`ffmpeg -ss ${time} -i "${tempVideoPath}" -frames:v 1 -vf scale=224:224 "${output}" -hide_banner -loglevel error`);
    return output;
  });

  for (const framePath of framePaths) {
    const buffer = fs.readFileSync(framePath);
    const flagged = await detectImageNSFW(buffer);
    if (flagged) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      return true;
    }
  }

  fs.rmSync(tempDir, { recursive: true, force: true });
  return false;
}

module.exports = DetectNSFW;
