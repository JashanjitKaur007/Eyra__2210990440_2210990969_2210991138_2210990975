// frontend/src/pages/FaceAnalysis.jsx
// Real-time face expression analysis page — fully integrated into eyra

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useFaceDetection } from '../hooks/useFaceDetection';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  ScanFace, Play, Square, AlertTriangle, Camera,
  BarChart3, Clock, Trash2, RefreshCw, Brain, TrendingUp,
  CheckCircle2, Info
} from 'lucide-react';

const EMOTIONS = {
  happy:     { emoji: '😄', color: '#f59e0b', bg: 'bg-amber-50',   border: 'border-amber-200',  text: 'text-amber-700',   label: 'Happy'     },
  sad:       { emoji: '😢', color: '#3b82f6', bg: 'bg-blue-50',    border: 'border-blue-200',   text: 'text-blue-700',    label: 'Sad'       },
  angry:     { emoji: '😠', color: '#ef4444', bg: 'bg-red-50',     border: 'border-red-200',    text: 'text-red-700',     label: 'Angry'     },
  fearful:   { emoji: '😨', color: '#8b5cf6', bg: 'bg-violet-50',  border: 'border-violet-200', text: 'text-violet-700',  label: 'Fearful'   },
  disgusted: { emoji: '🤢', color: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-200',text: 'text-emerald-700', label: 'Disgusted' },
  surprised: { emoji: '😲', color: '#f97316', bg: 'bg-orange-50',  border: 'border-orange-200', text: 'text-orange-700',  label: 'Surprised' },
  neutral:   { emoji: '😐', color: '#6b7280', bg: 'bg-gray-50',    border: 'border-gray-200',   text: 'text-gray-600',    label: 'Neutral'   },
};

const INSIGHTS = {
  happy:     "You're radiating positivity! Keep nurturing what brings you joy.",
  sad:       "It's okay to feel sad. Be gentle with yourself today.",
  angry:     "Noticing frustration is the first step. Try a few deep breaths.",
  fearful:   "Feeling anxious? Ground yourself — name 5 things you can see right now.",
  disgusted: "Strong aversion detected. Acknowledging discomfort helps process it.",
  surprised: "Something unexpected? Curiosity can turn surprise into growth.",
  neutral:   "Calm and balanced. A great state for reflection and clarity.",
};

function ConfidenceBar({ emotion, value, isDominant }) {
  const cfg = EMOTIONS[emotion] || EMOTIONS.neutral;
  return (
    <div className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${isDominant ? 'bg-emerald-50 border border-emerald-100' : ''}`}>
      <span className="text-lg w-7 text-center">{cfg.emoji}</span>
      <span className={`text-sm font-medium w-20 capitalize ${isDominant ? 'text-emerald-800' : 'text-slate-600'}`}>{cfg.label}</span>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${value}%`, backgroundColor: cfg.color }}
        />
      </div>
      <span className={`text-xs font-mono w-12 text-right ${isDominant ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
        {value.toFixed(1)}%
      </span>
    </div>
  );
}

function HistoryRow({ record }) {
  const cfg = EMOTIONS[record.emotion] || EMOTIONS.neutral;
  const time = new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-50 transition-colors">
      <span className="text-lg">{cfg.emoji}</span>
      <span className={`text-xs font-semibold uppercase tracking-wide ${cfg.text} flex-1`}>{cfg.label}</span>
      <span className="text-xs font-mono text-slate-500 w-14 text-right">{record.confidence.toFixed(1)}%</span>
      <span className="text-xs text-slate-400 w-20 text-right font-mono">{time}</span>
    </div>
  );
}

const FaceAnalysis = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { user } = useAuth();

  const { status, error, currentResult, faceDetected, startDetection, stopDetection } =
    useFaceDetection(videoRef, canvasRef);

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [emotionSummary, setEmotionSummary] = useState({});

  const isRunning = ['detecting', 'loading', 'ready'].includes(status);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await axios.get('/face/history?limit=30');
      setHistory(res.data.data || []);
      setEmotionSummary(res.data.emotionSummary || {});
    } catch (e) {
      setHistoryError('Could not load history. Is the backend running?');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(loadHistory, 10000);
    return () => clearInterval(id);
  }, [isRunning, loadHistory]);

  const prevResultRef = useRef(null);
  useEffect(() => {
    if (currentResult && currentResult !== prevResultRef.current) {
      prevResultRef.current = currentResult;
      setTimeout(loadHistory, 600);
    }
  }, [currentResult, loadHistory]);

  const handleToggle = () => { if (isRunning) stopDetection(); else startDetection(); };

  const handleClearHistory = async () => {
    if (!window.confirm('Clear all your face analysis history?')) return;
    try {
      await axios.delete('/face/history');
      setHistory([]);
      setEmotionSummary({});
    } catch (e) { alert('Failed to clear history.'); }
  };

  const dominant = currentResult ? EMOTIONS[currentResult.emotion] : null;
  const sortedExpressions = currentResult
    ? Object.entries(currentResult.allExpressions).sort((a, b) => b[1] - a[1])
    : [];
  const totalRecords = Object.values(emotionSummary).reduce((s, v) => s + v, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-sm">
              <ScanFace className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Face Insights</h1>
              <p className="text-sm text-slate-500">Real-time emotional expression analysis</p>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
            <Info className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-sm text-emerald-700">
              Your camera feed is processed locally in your browser — no video is ever uploaded.
              Only emotion scores are saved to help track your emotional wellbeing over time.
            </p>
          </div>
        </div>

        {/* 3-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* LEFT — Camera */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="relative aspect-[4/3] bg-slate-900">
                <video ref={videoRef} className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} autoPlay muted playsInline />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ transform: 'scaleX(-1)' }} />

                {status === 'idle' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 gap-3">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
                      <Camera className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-400 text-sm text-center px-6">Press Start to activate your camera</p>
                  </div>
                )}
                {status === 'loading' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 gap-4">
                    <div className="w-10 h-10 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                    <p className="text-slate-400 text-sm">Loading AI models…</p>
                  </div>
                )}
                {status === 'detecting' && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-emerald-400 text-xs font-mono font-semibold">LIVE</span>
                  </div>
                )}
                {status === 'detecting' && !faceDetected && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-slate-400 text-xs">No face detected</span>
                  </div>
                )}
                {status === 'detecting' && faceDetected && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-emerald-600/80 backdrop-blur-sm px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                    <span className="text-white text-xs font-medium">Face detected</span>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <button
                  onClick={handleToggle}
                  disabled={status === 'loading'}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all ${
                    isRunning
                      ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {status === 'loading' ? (
                    <><div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" /> Loading…</>
                  ) : isRunning ? (
                    <><Square className="w-4 h-4" /> Stop Detection</>
                  ) : (
                    <><Play className="w-4 h-4" /> Start Detection</>
                  )}
                </button>
                {error && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-600 leading-relaxed">{error}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Detection Info</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Model', value: 'TinyFaceDetector' },
                  { label: 'Interval', value: '1.5 seconds' },
                  { label: 'Smoothing', value: '5 frames' },
                  { label: 'Processing', value: 'On-device' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-2.5">
                    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                    <p className="text-xs font-semibold text-slate-700">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER — Live results */}
          <div className="lg:col-span-1 space-y-4">

            {/* Dominant emotion hero */}
            <div
              className="bg-white rounded-3xl shadow-sm border p-6 text-center transition-all duration-500"
              style={{ borderColor: dominant ? `${dominant.color}55` : '#f1f5f9', borderWidth: dominant ? 2 : 1 }}
            >
              {dominant ? (
                <>
                  <div className="text-5xl mb-3">{dominant.emoji}</div>
                  <div className="text-2xl font-bold mb-1" style={{ color: dominant.color }}>{dominant.label}</div>
                  <div className="text-5xl font-mono font-bold mb-1" style={{ color: dominant.color }}>
                    {currentResult.confidence.toFixed(1)}%
                  </div>
                  <p className="text-xs text-slate-400 mb-4">confidence</p>
                  <div className="bg-slate-50 rounded-2xl p-3 text-left">
                    <div className="flex items-start gap-2">
                      <Brain className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {INSIGHTS[currentResult.emotion] || INSIGHTS.neutral}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-3 opacity-30">◎</div>
                  <p className="text-slate-400 text-sm">
                    {status === 'idle' ? 'Start detection to see live results' : 'Position your face in the camera…'}
                  </p>
                </>
              )}
            </div>

            {/* Breakdown bars */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Expression Breakdown</h3>
              <div className="space-y-1">
                {sortedExpressions.length > 0
                  ? sortedExpressions.map(([emotion, pct]) => (
                      <ConfidenceBar key={emotion} emotion={emotion} value={pct} isDominant={emotion === currentResult?.emotion} />
                    ))
                  : Object.keys(EMOTIONS).map((e) => (
                      <ConfidenceBar key={e} emotion={e} value={0} isDominant={false} />
                    ))}
              </div>
            </div>

            {/* Session summary chips */}
            {totalRecords > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Session Summary</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(emotionSummary).sort((a, b) => b[1] - a[1]).map(([emotion, count]) => {
                    const cfg = EMOTIONS[emotion] || EMOTIONS.neutral;
                    const pct = ((count / totalRecords) * 100).toFixed(0);
                    return (
                      <div key={emotion} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.border}`}>
                        <span>{cfg.emoji}</span>
                        <span className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}</span>
                        <span className={`text-xs font-mono ${cfg.text} opacity-70`}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-400 mt-3">Based on {totalRecords} recorded detections</p>
              </div>
            )}
          </div>

          {/* RIGHT — History log */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-slate-500" />
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Detection Log</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={loadHistory} disabled={historyLoading}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Refresh">
                    <RefreshCw className={`w-3.5 h-3.5 ${historyLoading ? 'animate-spin' : ''}`} />
                  </button>
                  {history.length > 0 && (
                    <button onClick={handleClearHistory}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Clear history">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {historyError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl mb-3">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <p className="text-xs text-red-600">{historyError}</p>
                </div>
              )}

              {!historyLoading && history.length === 0 && !historyError && (
                <div className="text-center py-10">
                  <Clock className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Start detection to see your log here</p>
                </div>
              )}

              {historyLoading && history.length === 0 && (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
                </div>
              )}

              {history.length > 0 && (
                <div className="max-h-[420px] overflow-y-auto space-y-0.5 -mx-1 px-1">
                  {history.map((rec) => <HistoryRow key={rec._id} record={rec} />)}
                </div>
              )}

              {history.length > 0 && (
                <p className="text-xs text-slate-400 text-center mt-3 pt-3 border-t border-slate-100">
                  Showing {history.length} of {totalRecords} total
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>Wellness reminder:</strong> Face Insights is a supportive tool, not a medical diagnostic service.
            If you're experiencing persistent emotional difficulties, please speak with a qualified mental health professional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FaceAnalysis;
