// A simple sound manager using Web Audio API to avoid external assets
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

function createOscillator(type: OscillatorType, frequency: number, duration: number, volume: number) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

export const playHoverSound = () => {
  // Soft, high-pitched chime-like sound for hover
  createOscillator('sine', 880, 0.05, 0.05);
};

export const playClickSound = () => {
  // Softer click/thud sound
  createOscillator('sine', 440, 0.1, 0.1);
};
