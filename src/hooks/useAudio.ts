"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Web Audio API pure synthesizer sound generator
// Zero external mp3 dependencies, instant playback, zero latency!

class AudioSynthEngine {
  private ctx: AudioContext | null = null;
  private humGain: GainNode | null = null;
  private isMuted: boolean = false;
  private humOsc1: OscillatorNode | null = null;
  private humOsc2: OscillatorNode | null = null;

  constructor() {
    // Initialized lazily on first user interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.humGain && this.ctx) {
      this.humGain.gain.setTargetAtTime(
        muted ? 0 : 0.04,
        this.ctx.currentTime,
        0.1
      );
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  // Data center cooling hum (Dual low-frequency sine/triangle drone with low-pass filter)
  public startAmbientHum() {
    if (this.humGain || typeof window === "undefined") return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const masterHumGain = this.ctx.createGain();
      masterHumGain.gain.setValueAtTime(this.isMuted ? 0 : 0.04, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      const osc1 = this.ctx.createOscillator();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(60, this.ctx.currentTime); // 60Hz server fan drone

      const osc2 = this.ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(120, this.ctx.currentTime); // 120Hz harmonic hum

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterHumGain);
      masterHumGain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();

      this.humOsc1 = osc1;
      this.humOsc2 = osc2;
      this.humGain = masterHumGain;
    } catch (e) {
      console.warn("Audio hum init deferred", e);
    }
  }

  // Mechanical switch / latch click
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {
      console.error(e);
    }
  }

  // Heavy mechanical server blade locking "CHUNK"
  public playChunk() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Low thump
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = "triangle";
      subOsc.frequency.setValueAtTime(160, now);
      subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.15);
      subGain.gain.setValueAtTime(0.6, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.15);

      // Metal clack noise burst
      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(1800, now);
      noiseFilter.Q.setValueAtTime(3, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      whiteNoise.start(now);
    } catch (e) {
      console.error(e);
    }
  }

  // Metallic sliding whirr during Hot-Swap ejection
  public playSlide() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.linearRampToValueAtTime(800, now + 0.35);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.linearRampToValueAtTime(1400, now + 0.35);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch (e) {
      console.error(e);
    }
  }

  // Outbid Siren / Alert sound
  public playAlarm() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.setValueAtTime(1200, now + 0.1);
      osc.frequency.setValueAtTime(900, now + 0.2);
      osc.frequency.setValueAtTime(1200, now + 0.3);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      console.error(e);
    }
  }

  // Victory / Brag chime chord
  public playSuccess() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5];

      freqs.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now + i * 0.06);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.2, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + 1.2);
      });
    } catch (e) {
      console.error(e);
    }
  }
}

// Global singleton instance
let synthEngineInstance: AudioSynthEngine | null = null;

function getSynthEngine(): AudioSynthEngine {
  if (!synthEngineInstance) {
    synthEngineInstance = new AudioSynthEngine();
  }
  return synthEngineInstance;
}

export function useAudio() {
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const engineRef = useRef<AudioSynthEngine | null>(null);

  useEffect(() => {
    engineRef.current = getSynthEngine();
  }, []);

  const toggleSound = useCallback(() => {
    if (!engineRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    engineRef.current.setMuted(nextMuted);

    if (!hasStarted && !nextMuted) {
      engineRef.current.startAmbientHum();
      setHasStarted(true);
    }
  }, [isMuted, hasStarted]);

  const playClick = useCallback(() => engineRef.current?.playClick(), []);
  const playChunk = useCallback(() => engineRef.current?.playChunk(), []);
  const playSlide = useCallback(() => engineRef.current?.playSlide(), []);
  const playAlarm = useCallback(() => engineRef.current?.playAlarm(), []);
  const playSuccess = useCallback(() => engineRef.current?.playSuccess(), []);

  // Allow auto-starting hum on first document click
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (engineRef.current && !hasStarted && !isMuted) {
        engineRef.current.startAmbientHum();
        setHasStarted(true);
      }
    };
    window.addEventListener("click", handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener("click", handleFirstInteraction);
    };
  }, [hasStarted, isMuted]);

  return {
    isMuted,
    toggleSound,
    playClick,
    playChunk,
    playSlide,
    playAlarm,
    playSuccess,
  };
}
