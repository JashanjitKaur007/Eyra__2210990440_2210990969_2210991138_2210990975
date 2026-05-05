#!/usr/bin/env node
// scripts/download-models.js
// Downloads face-api.js model weights into frontend/public/models/
// Run once: node scripts/download-models.js

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL =
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

// const MODEL_DIR = path.join(__dirname, '..', 'frontend', 'public', 'models');
const MODEL_DIR = path.join(__dirname, '..', 'public', 'models');

// Files needed for TinyFaceDetector + FaceExpressionNet
const FILES = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_expression_model-weights_manifest.json',
  'face_expression_model-shard1',
];

function download(filename) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/${filename}`;
    const dest = path.join(MODEL_DIR, filename);

    if (fs.existsSync(dest)) {
      console.log(`  ✓ Already exists: ${filename}`);
      return resolve();
    }

    const file = fs.createWriteStream(dest);
    console.log(`  ↓ Downloading: ${filename}`);

    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`  ✅ Done: ${filename}`);
          resolve();
        });
      })
      .on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

async function main() {
  if (!fs.existsSync(MODEL_DIR)) {
    fs.mkdirSync(MODEL_DIR, { recursive: true });
    console.log(`📁 Created: ${MODEL_DIR}`);
  }

  console.log('\n🤖 Downloading face-api.js models...\n');

  for (const file of FILES) {
    try {
      await download(file);
    } catch (err) {
      console.error(`  ❌ Failed: ${file} — ${err.message}`);
      process.exit(1);
    }
  }

  console.log('\n✅ All models downloaded successfully!');
  console.log(`📂 Location: ${MODEL_DIR}\n`);
}

main();
