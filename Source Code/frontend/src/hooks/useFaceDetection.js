// frontend/src/hooks/useFaceDetection.js
// Custom hook for real-time face expression analysis
// Uses face-api.js TinyFaceDetector + FaceExpressionNet
// Posts results to the eyra backend via axios (with auth token)

import { useRef, useState, useEffect, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';

const MODEL_URL = '/models';
const DETECTION_INTERVAL_MS = 1500; // detect every 1.5 seconds
const SMOOTHING_FRAMES = 5;         // rolling average over last N frames

const EMOTION_LABELS = [
  'neutral', 'happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised',
];

// POST to eyra backend — uses axios which already has the auth header set
async function postAnalysis(payload) {
  try {
    await axios.post('/face/analyze', payload);
  } catch (e) {
    // Non-blocking — just log, don't break UI
    console.warn('[FaceAPI] Failed to save result:', e.message);
  }
}

// ─────────────────────────────────────────────────────────
export function useFaceDetection(videoRef, canvasRef) {
  const [status, setStatus] = useState('idle'); // idle | loading | ready | detecting | error
  const [error, setError] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);

  const frameBuffer = useRef([]);
  const intervalRef = useRef(null);
  const streamRef = useRef(null);
  const modelsLoaded = useRef(false);

  // ── Load face-api.js models ──────────────────────────
  const loadModels = useCallback(async () => {
    if (modelsLoaded.current) return;
    setStatus('loading');
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      modelsLoaded.current = true;
      setStatus('ready');
    } catch (err) {
      setStatus('error');
      setError(
        'Could not load AI models. Make sure model files exist in /public/models. ' +
        'Run: node scripts/download-models.js'
      );
      console.error('[loadModels]', err);
    }
  }, []);

  // ── Start webcam stream ───────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = resolve;
        });
        await videoRef.current.play();
      }
    } catch (err) {
      let msg = `Camera error: ${err.message}`;
      if (err.name === 'NotAllowedError') msg = 'Camera access denied. Please allow camera permissions and reload.';
      if (err.name === 'NotFoundError') msg = 'No camera device found on this device.';
      setError(msg);
      setStatus('error');
      throw err;
    }
  }, [videoRef]);

  // ── Rolling average smoothing ─────────────────────────
  const smoothExpressions = useCallback((raw) => {
    frameBuffer.current.push(raw);
    if (frameBuffer.current.length > SMOOTHING_FRAMES) frameBuffer.current.shift();

    const n = frameBuffer.current.length;
    const averaged = {};
    for (const label of EMOTION_LABELS) {
      const sum = frameBuffer.current.reduce((acc, f) => acc + (f[label] || 0), 0);
      averaged[label] = sum / n;
    }
    return averaged;
  }, []);

  // ── Single detection tick ─────────────────────────────
  const detectOnce = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || video.readyState < 2) return;

    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 }))
      .withFaceExpressions();

    if (!detection) {
      setFaceDetected(false);
      // Clear stale canvas
      if (canvas) {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    setFaceDetected(true);

    // Draw detection overlay with eyra emerald brand color
    if (canvas) {
      const dims = faceapi.matchDimensions(canvas, video, true);
      const resized = faceapi.resizeResults(detection, dims);
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const box = resized.detection.box;
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.9)'; // emerald-500
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
      ctx.shadowBlur = 12;
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      // Corner accent marks
      const cSize = 14;
      ctx.lineWidth = 3;
      [
        [box.x, box.y],
        [box.x + box.width, box.y],
        [box.x, box.y + box.height],
        [box.x + box.width, box.y + box.height],
      ].forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy + (cy === box.y ? cSize : -cSize));
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + (cx === box.x ? cSize : -cSize), cy);
        ctx.stroke();
      });
    }

    // Smooth and find dominant emotion
    const smoothed = smoothExpressions(detection.expressions);
    const entries = Object.entries(smoothed);
    const [dominantEmotion, dominantScore] = entries.reduce(
      (best, curr) => (curr[1] > best[1] ? curr : best),
      ['neutral', 0]
    );

    const confidence = parseFloat((dominantScore * 100).toFixed(1));
    const allExpressions = {};
    for (const [k, v] of entries) {
      allExpressions[k] = parseFloat((v * 100).toFixed(1));
    }

    const result = {
      emotion: dominantEmotion,
      confidence,
      allExpressions,
      timestamp: new Date().toISOString(),
    };

    setCurrentResult(result);
    setStatus('detecting');

    // Save to backend (fire-and-forget)
    postAnalysis(result);
  }, [videoRef, canvasRef, smoothExpressions]);

  // ── Start / stop loop ─────────────────────────────────
  const startDetection = useCallback(async () => {
    setError(null);
    await loadModels();
    await startCamera();
    setStatus('detecting');
    intervalRef.current = setInterval(() => {
      detectOnce().catch((err) => console.warn('[detectOnce error]', err));
    }, DETECTION_INTERVAL_MS);
  }, [loadModels, startCamera, detectOnce]);

  const stopDetection = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (videoRef.current) videoRef.current.srcObject = null;
    if (canvasRef.current) {
      canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    frameBuffer.current = [];
    setStatus('idle');
    setFaceDetected(false);
    setCurrentResult(null);
  }, [videoRef, canvasRef]);

  // Cleanup on unmount
  useEffect(() => () => stopDetection(), [stopDetection]);

  return { status, error, currentResult, faceDetected, startDetection, stopDetection };
}
