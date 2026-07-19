import { useCallback, useEffect, useRef, useState } from 'react';
import { AudioContext } from 'react-native-audio-api';
import type { AnalyserNode, AudioBuffer, AudioBufferSourceNode } from 'react-native-audio-api';

const FFT_SIZE = 256;

export const WAVEFORM_BIN_COUNT = FFT_SIZE / 2;

interface UseWaveformPlayerOptions {
  onFinished?: () => void;
}

export interface WaveformPlayer {
  loaded: boolean;
  playing: boolean;
  duration: number;
  currentTime: number;
  toggle: () => Promise<void>;
  pause: () => void;
  readFrequencyData: (out: Uint8Array) => void;
}

export function useWaveformPlayer(
  source: number | string,
  { onFinished }: UseWaveformPlayerOptions = {},
): WaveformPlayer {
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const offsetRef = useRef(0);
  const startedAtRef = useRef(0);
  const manualStopRef = useRef(false);
  const onFinishedRef = useRef(onFinished);

  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  useEffect(() => {
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    analyser.smoothingTimeConstant = 0;
    analyser.connect(ctx.destination);
    ctxRef.current = ctx;
    analyserRef.current = analyser;

    let cancelled = false;
    ctx
      .decodeAudioData(source)
      .then((buffer) => {
        if (cancelled) return;
        bufferRef.current = buffer;
        setDuration(buffer.duration);
        setLoaded(true);
      })
      .catch((error) => console.warn('Error decoding audio:', error));

    return (): void => {
      cancelled = true;
      manualStopRef.current = true;
      try {
        sourceRef.current?.stop();
      } catch {}
      try {
        ctx.close();
      } catch {}
      sourceRef.current = null;
      ctxRef.current = null;
      analyserRef.current = null;
      bufferRef.current = null;
    };
  }, [source]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      const pos = ctx.currentTime - startedAtRef.current;
      setCurrentTime(Math.min(pos, bufferRef.current?.duration ?? pos));
    }, 200);
    return (): void => clearInterval(id);
  }, [playing]);

  const pause = useCallback((): void => {
    const ctx = ctxRef.current;
    const node = sourceRef.current;
    if (!ctx || !node) return;

    manualStopRef.current = true;
    const pos = Math.max(0, ctx.currentTime - startedAtRef.current);
    offsetRef.current = Math.min(pos, bufferRef.current?.duration ?? pos);
    try {
      node.stop();
    } catch {}
    setCurrentTime(offsetRef.current);
    setPlaying(false);
  }, []);

  const startPlayback = useCallback(async (): Promise<void> => {
    const ctx = ctxRef.current;
    const buffer = bufferRef.current;
    const analyser = analyserRef.current;
    if (!ctx || !buffer || !analyser) return;

    if (ctx.state === 'closed') return;

    try {
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
    } catch (error) {
      console.warn('Error resuming AudioContext:', error);
      return;
    }

    const node = ctx.createBufferSource();
    node.buffer = buffer;
    node.connect(analyser);
    node.onEnded = (): void => {
      node.disconnect();
      if (sourceRef.current === node) {
        sourceRef.current = null;
      }
      if (manualStopRef.current) {
        manualStopRef.current = false;
        return;
      }
      offsetRef.current = 0;
      setCurrentTime(buffer.duration);
      setPlaying(false);
      onFinishedRef.current?.();
    };
    node.start(0, offsetRef.current);
    startedAtRef.current = ctx.currentTime - offsetRef.current;
    sourceRef.current = node;
    manualStopRef.current = false;
    setPlaying(true);
  }, []);

  const toggle = useCallback(async (): Promise<void> => {
    if (!loaded) return;
    if (playing) {
      pause();
      return;
    }
    const dur = bufferRef.current?.duration ?? 0;
    if (dur > 0 && offsetRef.current >= dur - 0.05) {
      offsetRef.current = 0;
      setCurrentTime(0);
    }
    await startPlayback();
  }, [loaded, playing, pause, startPlayback]);

  const readFrequencyData = useCallback((out: Uint8Array): void => {
    analyserRef.current?.getByteFrequencyData(out);
  }, []);

  return { loaded, playing, duration, currentTime, toggle, pause, readFrequencyData };
}
