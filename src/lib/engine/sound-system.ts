// Audio Chime & Sensory Cues using Web Audio API (Zero External Assets Needed)
class SoundSystem {
	private ctx: AudioContext | null = null;

	private init() {
		if (typeof window === 'undefined') return;
		if (!this.ctx) {
			const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
			if (AudioContextClass) {
				this.ctx = new AudioContextClass();
			}
		}
	}

	// Gentle, pleasant chime for completing a step / passing an audit
	playCompletion(enabled: boolean) {
		if (!enabled) return;
		try {
			this.init();
			if (!this.ctx) return;
			if (this.ctx.state === 'suspended') {
				this.ctx.resume();
			}

			const now = this.ctx.currentTime;
			const osc = this.ctx.createOscillator();
			const gain = this.ctx.createGain();

			osc.type = 'sine';
			// Major chord arpeggio cue (E5 to A5)
			osc.frequency.setValueAtTime(659.25, now);
			osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.15);

			gain.gain.setValueAtTime(0.001, now);
			gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
			gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

			osc.connect(gain);
			gain.connect(this.ctx.destination);

			osc.start(now);
			osc.stop(now + 0.55);
		} catch (e) {
			console.debug('Audio cue prevented or unsupported', e);
		}
	}

	// Gentle bell for timer milestone (e.g. 10m countdown finish or break reminder)
	playTimerBell(enabled: boolean) {
		if (!enabled) return;
		try {
			this.init();
			if (!this.ctx) return;
			if (this.ctx.state === 'suspended') {
				this.ctx.resume();
			}

			const now = this.ctx.currentTime;
			const osc = this.ctx.createOscillator();
			const gain = this.ctx.createGain();

			osc.type = 'triangle';
			osc.frequency.setValueAtTime(523.25, now); // C5
			osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.25); // C6

			gain.gain.setValueAtTime(0.001, now);
			gain.gain.linearRampToValueAtTime(0.15, now + 0.08);
			gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

			osc.connect(gain);
			gain.connect(this.ctx.destination);

			osc.start(now);
			osc.stop(now + 0.85);
		} catch (e) {
			console.debug('Audio cue prevented or unsupported', e);
		}
	}
}

export const soundSystem = new SoundSystem();
