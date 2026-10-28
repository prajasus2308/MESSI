/**
 * Enhanced cinematic stadium synthesizer via Web Audio API.
 * Creates an ambient low-frequency sub-hum, ethereal harmonic shimmer, and white noise for crowd atmosphere.
 */
class StadiumAmbience {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private nodes: AudioNode[] = [];

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public start() {
    try {
      if (!this.ctx) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtxClass();
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.2, this.ctx.currentTime + 3); // Slightly higher volume
      this.masterGain.connect(this.ctx.destination);

      // Low stadium sub-hum (55Hz / A1)
      const subOsc = this.ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(55, this.ctx.currentTime);

      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      subOsc.connect(subGain);
      subGain.connect(this.masterGain);
      subOsc.start();
      this.nodes.push(subOsc, subGain);

      // Warm cinematic fifth (82.4Hz / E2)
      const fifthOsc = this.ctx.createOscillator();
      fifthOsc.type = 'sine';
      fifthOsc.frequency.setValueAtTime(82.41, this.ctx.currentTime);

      const fifthGain = this.ctx.createGain();
      fifthGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      fifthOsc.connect(fifthGain);
      fifthGain.connect(this.masterGain);
      fifthOsc.start();
      this.nodes.push(fifthOsc, fifthGain);

      // Ethereal high harmonic (220Hz / A3)
      const highOsc = this.ctx.createOscillator();
      highOsc.type = 'triangle';
      highOsc.frequency.setValueAtTime(220, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      const highGain = this.ctx.createGain();
      highGain.gain.setValueAtTime(0.1, this.ctx.currentTime);

      highOsc.connect(filter);
      filter.connect(highGain);
      highGain.connect(this.masterGain);
      highOsc.start();
      this.nodes.push(highOsc, filter, highGain);

      // Crowd hum (White Noise + Lowpass Filter)
      const bufferSize = 2 * this.ctx.sampleRate;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const crowdFilter = this.ctx.createBiquadFilter();
      crowdFilter.type = 'lowpass';
      crowdFilter.frequency.setValueAtTime(400, this.ctx.currentTime);

      const crowdGain = this.ctx.createGain();
      crowdGain.gain.setValueAtTime(0.05, this.ctx.currentTime); // Subtle volume

      noise.connect(crowdFilter);
      crowdFilter.connect(crowdGain);
      crowdGain.connect(this.masterGain);
      noise.start();
      this.nodes.push(noise, crowdFilter, crowdGain);

      this.isPlaying = true;
    } catch {
      this.isPlaying = false;
    }
  }

  public stop() {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
      setTimeout(() => {
        this.nodes.forEach(node => {
          try {
            if ('stop' in node) (node as OscillatorNode | AudioBufferSourceNode).stop();
            node.disconnect();
          } catch {
            // ignore
          }
        });
        this.nodes = [];
        this.isPlaying = false;
      }, 1200);
    } else {
      this.isPlaying = false;
    }
  }
}

export const stadiumAudio = new StadiumAmbience();
