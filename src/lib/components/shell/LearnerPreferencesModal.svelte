<script lang="ts">
	import { practiceStore, type LearnerPreferences } from '$lib/state/practice.svelte';
	import { soundSystem } from '$lib/engine/sound-system';
	import {
		X,
		Sliders,
		Type,
		Palette,
		Brain,
		Volume2,
		VolumeX,
		Sparkles,
		Eye,
		Maximize2,
		Minimize2,
		Check,
		Download,
		Upload,
		RotateCcw,
		Zap
	} from '@lucide/svelte';

	let { isOpen, onClose }: { isOpen: boolean; onClose: () => void } = $props();

	type SettingsTab = 'typography' | 'theme' | 'focus' | 'backup';
	let currentTab = $state<SettingsTab>('typography');

	let prefs = $derived(practiceStore.learnerPreferences);

	function updatePref<K extends keyof LearnerPreferences>(key: K, value: LearnerPreferences[K]) {
		practiceStore.learnerPreferences[key] = value;
		practiceStore.saveToStorage();
	}

	function testChime() {
		soundSystem.playCompletion(true);
	}

	// 1-Click Archetype Presets
	function applyPreset(name: 'adhd' | 'dyslexia' | 'high-contrast' | 'default') {
		if (name === 'adhd') {
			practiceStore.learnerPreferences = {
				fontFamily: 'sans',
				fontSize: 'base',
				theme: 'dark',
				reducedMotion: false,
				focusMode: true,
				plainLanguageHelp: true,
				soundEnabled: true,
				lineSpacing: 'relaxed'
			};
		} else if (name === 'dyslexia') {
			practiceStore.learnerPreferences = {
				fontFamily: 'dyslexic',
				fontSize: 'lg',
				theme: 'sepia',
				reducedMotion: true,
				focusMode: false,
				plainLanguageHelp: true,
				soundEnabled: false,
				lineSpacing: 'loose'
			};
		} else if (name === 'high-contrast') {
			practiceStore.learnerPreferences = {
				fontFamily: 'mono',
				fontSize: 'lg',
				theme: 'high-contrast',
				reducedMotion: true,
				focusMode: false,
				plainLanguageHelp: false,
				soundEnabled: true,
				lineSpacing: 'relaxed'
			};
		} else {
			practiceStore.learnerPreferences = {
				fontFamily: 'sans',
				fontSize: 'base',
				theme: 'dark',
				reducedMotion: false,
				focusMode: false,
				plainLanguageHelp: false,
				soundEnabled: false,
				lineSpacing: 'normal'
			};
		}
		practiceStore.saveToStorage();
	}

	// Backup & Restore
	let importError = $state('');
	let importSuccess = $state('');

	function exportBackup() {
		const raw = localStorage.getItem('dtm_practice_store_v1') || '{}';
		const blob = new Blob([raw], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `directing-the-machine-backup-${new Date().toISOString().slice(0, 10)}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function handleImportFile(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const content = e.target?.result as string;
				JSON.parse(content); // Test valid JSON
				localStorage.setItem('dtm_practice_store_v1', content);
				practiceStore.loadFromStorage();
				importSuccess = 'Studio data restored successfully! Reloading...';
				importError = '';
				setTimeout(() => {
					window.location.reload();
				}, 1200);
			} catch (err) {
				importError = 'Invalid JSON backup file. Please verify file integrity.';
				importSuccess = '';
			}
		};
		reader.readAsText(file);
	}
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
		aria-labelledby="pref-modal-title"
	>
		<div
			class="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
		>
			<!-- Modal Header -->
			<div class="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
						<Sliders class="w-5 h-5" />
					</div>
					<div>
						<h2 id="pref-modal-title" class="text-lg font-bold text-neutral-100 flex items-center gap-2">
							Learner Preferences & Adaptability
							<span class="text-xs font-normal px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700">A11y</span>
						</h2>
						<p class="text-xs text-neutral-400">Tailor the studio workbench to your cognitive, visual, and learning style.</p>
					</div>
				</div>
				<button
					onclick={onClose}
					class="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-xl transition"
					aria-label="Close preferences"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Quick 1-Click Presets -->
			<div class="px-6 py-3 bg-neutral-950/60 border-b border-neutral-800/80 flex flex-wrap items-center gap-2">
				<span class="text-xs font-medium text-neutral-400 flex items-center gap-1.5 mr-2">
					<Zap class="w-3.5 h-3.5 text-amber-400" />
					1-Click Presets:
				</span>
				<button
					onclick={() => applyPreset('adhd')}
					class="text-xs px-3 py-1 rounded-xl bg-neutral-800/80 hover:bg-amber-500/20 hover:text-amber-300 border border-neutral-700/60 text-neutral-300 transition"
				>
					ADHD / Executive Focus
				</button>
				<button
					onclick={() => applyPreset('dyslexia')}
					class="text-xs px-3 py-1 rounded-xl bg-neutral-800/80 hover:bg-amber-500/20 hover:text-amber-300 border border-neutral-700/60 text-neutral-300 transition"
				>
					Dyslexia & Low Glare
				</button>
				<button
					onclick={() => applyPreset('high-contrast')}
					class="text-xs px-3 py-1 rounded-xl bg-neutral-800/80 hover:bg-amber-500/20 hover:text-amber-300 border border-neutral-700/60 text-neutral-300 transition"
				>
					High Contrast (WCAG AAA)
				</button>
				<button
					onclick={() => applyPreset('default')}
					class="text-xs px-3 py-1 rounded-xl bg-neutral-800/40 hover:bg-neutral-700/60 border border-neutral-700/40 text-neutral-400 transition"
				>
					Reset Default
				</button>
			</div>

			<!-- Tabs Navigation -->
			<div class="flex border-b border-neutral-800 px-6 bg-neutral-900/50">
				<button
					onclick={() => currentTab = 'typography'}
					class="px-4 py-3 text-xs font-medium border-b-2 transition flex items-center gap-2 {currentTab === 'typography' ? 'border-amber-400 text-amber-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'}"
				>
					<Type class="w-4 h-4" />
					<span>Typography & Reading</span>
				</button>
				<button
					onclick={() => currentTab = 'theme'}
					class="px-4 py-3 text-xs font-medium border-b-2 transition flex items-center gap-2 {currentTab === 'theme' ? 'border-amber-400 text-amber-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'}"
				>
					<Palette class="w-4 h-4" />
					<span>Palette & Sensory</span>
				</button>
				<button
					onclick={() => currentTab = 'focus'}
					class="px-4 py-3 text-xs font-medium border-b-2 transition flex items-center gap-2 {currentTab === 'focus' ? 'border-amber-400 text-amber-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'}"
				>
					<Brain class="w-4 h-4" />
					<span>Focus & Scaffolding</span>
				</button>
				<button
					onclick={() => currentTab = 'backup'}
					class="px-4 py-3 text-xs font-medium border-b-2 transition flex items-center gap-2 {currentTab === 'backup' ? 'border-amber-400 text-amber-400' : 'border-transparent text-neutral-400 hover:text-neutral-200'}"
				>
					<Download class="w-4 h-4" />
					<span>Data & Portability</span>
				</button>
			</div>

			<!-- Tab Contents -->
			<div class="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
				{#if currentTab === 'typography'}
					<!-- Font Family -->
					<div class="space-y-3">
						<div class="font-semibold text-neutral-200 block" id="label-typeface">Typeface Selection</div>
						<div class="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-labelledby="label-typeface">
							<button
								onclick={() => updatePref('fontFamily', 'sans')}
								class="p-4 rounded-2xl border text-left transition {prefs.fontFamily === 'sans' ? 'border-amber-400 bg-amber-500/10 text-neutral-100 ring-1 ring-amber-400/30' : 'border-neutral-800 bg-neutral-950/60 text-neutral-300 hover:border-neutral-700'}"
							>
								<div class="font-sans font-bold text-base mb-1">Standard Sans</div>
								<div class="text-xs text-neutral-400">Clean, geometric system typeface for high visual clarity.</div>
							</button>

							<button
								onclick={() => updatePref('fontFamily', 'dyslexic')}
								class="p-4 rounded-2xl border text-left transition {prefs.fontFamily === 'dyslexic' ? 'border-amber-400 bg-amber-500/10 text-neutral-100 ring-1 ring-amber-400/30' : 'border-neutral-800 bg-neutral-950/60 text-neutral-300 hover:border-neutral-700'}"
							>
								<div class="font-bold text-base mb-1 text-amber-300" style="font-family: 'OpenDyslexic', 'Lexend', sans-serif;">OpenDyslexic / Lexend</div>
								<div class="text-xs text-neutral-400">Heavy-bottom letters to mitigate letter-flipping and visual fatigue.</div>
							</button>

							<button
								onclick={() => updatePref('fontFamily', 'mono')}
								class="p-4 rounded-2xl border text-left transition {prefs.fontFamily === 'mono' ? 'border-amber-400 bg-amber-500/10 text-neutral-100 ring-1 ring-amber-400/30' : 'border-neutral-800 bg-neutral-950/60 text-neutral-300 hover:border-neutral-700'}"
							>
								<div class="font-mono font-bold text-base mb-1">JetBrains Mono</div>
								<div class="text-xs text-neutral-400">Monospaced rhythm for technical calibration and line-by-line reading.</div>
							</button>
						</div>
					</div>

					<!-- Text Size & Line Height -->
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-neutral-800/80">
						<div class="space-y-3">
							<div class="font-semibold text-neutral-200 block" id="label-text-scale">Text Scale</div>
							<div class="grid grid-cols-4 gap-2" role="radiogroup" aria-labelledby="label-text-scale">
								{#each [
									{ id: 'sm', label: 'Compact' },
									{ id: 'base', label: 'Default' },
									{ id: 'lg', label: 'Large' },
									{ id: 'xl', label: 'Extra' }
								] as item}
									<button
										onclick={() => updatePref('fontSize', item.id as any)}
										class="py-2.5 rounded-xl border text-xs font-medium transition {prefs.fontSize === item.id ? 'border-amber-400 bg-amber-500/10 text-amber-300' : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-neutral-200'}"
									>
										{item.label}
									</button>
								{/each}
							</div>
						</div>

						<div class="space-y-3">
							<div class="font-semibold text-neutral-200 block" id="label-spacing">Line Spacing (Leading)</div>
							<div class="grid grid-cols-3 gap-2" role="radiogroup" aria-labelledby="label-spacing">
								{#each [
									{ id: 'normal', label: 'Normal' },
									{ id: 'relaxed', label: 'Relaxed' },
									{ id: 'loose', label: 'Loose' }
								] as item}
									<button
										onclick={() => updatePref('lineSpacing', item.id as any)}
										class="py-2.5 rounded-xl border text-xs font-medium transition {prefs.lineSpacing === item.id ? 'border-amber-400 bg-amber-500/10 text-amber-300' : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:text-neutral-200'}"
									>
										{item.label}
									</button>
								{/each}
							</div>
						</div>
					</div>

				{:else if currentTab === 'theme'}
					<!-- Themes -->
					<div class="space-y-3">
						<div class="font-semibold text-neutral-200 block" id="label-contrast">Visual Contrast & Colorway</div>
						<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" role="radiogroup" aria-labelledby="label-contrast">
							<!-- 1. Dark (Obsidian) -->
							<button
								type="button"
								onclick={() => updatePref('theme', 'dark')}
								class="p-4 rounded-2xl border text-left transition {prefs.theme === 'dark' ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400/30' : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'}"
							>
								<div class="w-full h-8 rounded-lg bg-[#0c0d0e] border border-[#272a30] mb-2.5 flex items-center justify-between px-3">
									<div class="flex items-center gap-1.5">
										<div class="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
										<span class="text-[10px] font-mono text-[#f8fafc]">Aa</span>
									</div>
									<span class="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#272a30] text-amber-400">WCAG AA</span>
								</div>
								<div class="font-bold text-neutral-100 text-sm">Studio Obsidian</div>
								<div class="text-xs text-neutral-400 mt-0.5">Calibrated dark neutral with warm amber accents.</div>
							</button>

							<!-- 2. Light (Crisp Canvas) -->
							<button
								type="button"
								onclick={() => updatePref('theme', 'light')}
								class="p-4 rounded-2xl border text-left transition {prefs.theme === 'light' ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400/30' : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'}"
							>
								<div class="w-full h-8 rounded-lg bg-[#fbfaf8] border border-[#ded8cb] mb-2.5 flex items-center justify-between px-3">
									<div class="flex items-center gap-1.5">
										<div class="w-3 h-3 rounded-full bg-[#b45309]"></div>
										<span class="text-[10px] font-mono font-bold text-[#171717]">Aa</span>
									</div>
									<span class="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#eae6de] text-[#b45309]">WCAG AAA</span>
								</div>
								<div class="font-bold text-neutral-100 text-sm">Crisp Canvas (Light)</div>
								<div class="text-xs text-neutral-400 mt-0.5">Editorial ivory paper with deep carbon ink and bronze details.</div>
							</button>

							<!-- 3. Sepia (Warm Paper) -->
							<button
								type="button"
								onclick={() => updatePref('theme', 'sepia')}
								class="p-4 rounded-2xl border text-left transition {prefs.theme === 'sepia' ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400/30' : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'}"
							>
								<div class="w-full h-8 rounded-lg bg-[#fbf7ee] border border-[#dacbaf] mb-2.5 flex items-center justify-between px-3">
									<div class="flex items-center gap-1.5">
										<div class="w-3 h-3 rounded-full bg-[#92400e]"></div>
										<span class="text-[10px] font-mono font-bold text-[#2b2318]">Aa</span>
									</div>
									<span class="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#e6dac3] text-[#92400e]">Low Glare</span>
								</div>
								<div class="font-bold text-neutral-100 text-sm">Warm Paper (Sepia)</div>
								<div class="text-xs text-neutral-400 mt-0.5">Natural unbleached tone to minimize photophobia & fatigue.</div>
							</button>

							<!-- 4. Midnight Navy (OLED) -->
							<button
								type="button"
								onclick={() => updatePref('theme', 'midnight')}
								class="p-4 rounded-2xl border text-left transition {prefs.theme === 'midnight' ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400/30' : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'}"
							>
								<div class="w-full h-8 rounded-lg bg-[#080c14] border border-[#1e293b] mb-2.5 flex items-center justify-between px-3">
									<div class="flex items-center gap-1.5">
										<div class="w-3 h-3 rounded-full bg-[#38bdf8]"></div>
										<span class="text-[10px] font-mono text-[#f1f5f9]">Aa</span>
									</div>
									<span class="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#1e293b] text-[#38bdf8]">Circadian</span>
								</div>
								<div class="font-bold text-neutral-100 text-sm">Midnight Navy</div>
								<div class="text-xs text-neutral-400 mt-0.5">Deep indigo OLED dark mode with calming cyan accents.</div>
							</button>

							<!-- 5. High Contrast (WCAG AAA) -->
							<button
								type="button"
								onclick={() => updatePref('theme', 'high-contrast')}
								class="p-4 rounded-2xl border text-left transition {prefs.theme === 'high-contrast' ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400/30' : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'}"
							>
								<div class="w-full h-8 rounded-lg bg-black border border-white mb-2.5 flex items-center justify-between px-3">
									<div class="flex items-center gap-1.5">
										<div class="w-3 h-3 rounded-full bg-[#ffff00]"></div>
										<span class="text-[10px] font-mono font-bold text-white">Aa</span>
									</div>
									<span class="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black text-[#ffff00] border border-[#ffff00]">21:1 AAA</span>
								</div>
								<div class="font-bold text-neutral-100 text-sm">High Contrast (AAA)</div>
								<div class="text-xs text-neutral-400 mt-0.5">Pure black & white contrast with high-visibility target indicators.</div>
							</button>
						</div>
					</div>

					<!-- Sensory & Motion -->
					<div class="pt-4 border-t border-neutral-800/80 space-y-4">
						<div class="flex items-center justify-between p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
							<div>
								<div class="font-semibold text-neutral-200">Reduced Motion</div>
								<div class="text-xs text-neutral-400">Disables confetti, smooth sliding transitions, and chart pulses.</div>
							</div>
							<button
								onclick={() => updatePref('reducedMotion', !prefs.reducedMotion)}
								class="w-12 h-6 rounded-full transition relative {prefs.reducedMotion ? 'bg-amber-500' : 'bg-neutral-800'}"
								aria-label="Toggle reduced motion"
							>
								<span class="w-4 h-4 rounded-full bg-white absolute top-1 transition-transform {prefs.reducedMotion ? 'translate-x-7' : 'translate-x-1'}"></span>
							</button>
						</div>

						<div class="flex items-center justify-between p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
							<div>
								<div class="font-semibold text-neutral-200 flex items-center gap-2">
									Soundscape & Chime Feedback
									<button
										onclick={testChime}
										class="text-xs px-2 py-0.5 rounded bg-neutral-800 text-amber-400 hover:bg-neutral-700 flex items-center gap-1"
									>
										Test Chime
									</button>
								</div>
								<div class="text-xs text-neutral-400">Gentle Web Audio chimes on drill completion and timer milestones.</div>
							</div>
							<button
								onclick={() => updatePref('soundEnabled', !prefs.soundEnabled)}
								class="w-12 h-6 rounded-full transition relative {prefs.soundEnabled ? 'bg-amber-500' : 'bg-neutral-800'}"
								aria-label="Toggle sound cues"
							>
								<span class="w-4 h-4 rounded-full bg-white absolute top-1 transition-transform {prefs.soundEnabled ? 'translate-x-7' : 'translate-x-1'}"></span>
							</button>
						</div>
					</div>

				{:else if currentTab === 'focus'}
					<!-- Focus & Scaffolding -->
					<div class="space-y-4">
						<div class="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-3">
							<div class="flex items-center justify-between">
								<div>
									<div class="font-semibold text-neutral-200 flex items-center gap-2">
										<Brain class="w-4 h-4 text-amber-400" />
										Single-Task Horizon (ADHD Focus Mode)
									</div>
									<div class="text-xs text-neutral-400 mt-1 max-w-lg">
										In Today's Practice, hides all inactive steps and isolates just the current actionable task to prevent cognitive overload.
									</div>
								</div>
								<button
									onclick={() => updatePref('focusMode', !prefs.focusMode)}
									class="w-12 h-6 rounded-full transition relative {prefs.focusMode ? 'bg-amber-500' : 'bg-neutral-800'}"
									aria-label="Toggle single-task horizon"
								>
									<span class="w-4 h-4 rounded-full bg-white absolute top-1 transition-transform {prefs.focusMode ? 'translate-x-7' : 'translate-x-1'}"></span>
								</button>
							</div>
						</div>

						<div class="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-3">
							<div class="flex items-center justify-between">
								<div>
									<div class="font-semibold text-neutral-200 flex items-center gap-2">
										<Sparkles class="w-4 h-4 text-amber-400" />
										Plain-Language Scaffolding & Glossary Hints
									</div>
									<div class="text-xs text-neutral-400 mt-1 max-w-lg">
										Surfaces simplified explanations and inline definitions for specialized terms (Positionality, Brier Score, Diagnostic Ladders) for non-native English speakers.
									</div>
								</div>
								<button
									onclick={() => updatePref('plainLanguageHelp', !prefs.plainLanguageHelp)}
									class="w-12 h-6 rounded-full transition relative {prefs.plainLanguageHelp ? 'bg-amber-500' : 'bg-neutral-800'}"
									aria-label="Toggle plain-language assistance"
								>
									<span class="w-4 h-4 rounded-full bg-white absolute top-1 transition-transform {prefs.plainLanguageHelp ? 'translate-x-7' : 'translate-x-1'}"></span>
								</button>
							</div>
						</div>
					</div>

				{:else if currentTab === 'backup'}
					<!-- Data Portability -->
					<div class="space-y-4">
						<div class="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-3">
							<h3 class="font-semibold text-neutral-200">Local-First Storage & Data Mobility</h3>
							<p class="text-xs text-neutral-400 leading-relaxed">
								Your practice drills, calibration logs, problem statements, and baseline scores live exclusively in your browser's local storage. Export a portable snapshot anytime to transfer between devices or safeguard your studio history.
							</p>

							<div class="flex flex-wrap items-center gap-3 pt-2">
								<button
									onclick={exportBackup}
									class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs flex items-center gap-2 transition"
								>
									<Download class="w-4 h-4" />
									<span>Download JSON Backup</span>
								</button>

								<label
									class="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs flex items-center gap-2 transition cursor-pointer border border-neutral-700"
								>
									<Upload class="w-4 h-4" />
									<span>Restore from File</span>
									<input
										type="file"
										accept=".json"
										onchange={handleImportFile}
										class="hidden"
									/>
								</label>
							</div>

							{#if importSuccess}
								<div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs mt-2">
									{importSuccess}
								</div>
							{/if}
							{#if importError}
								<div class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs mt-2">
									{importError}
								</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>

			<!-- Footer -->
			<div class="px-6 py-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between text-xs text-neutral-400">
				<span>All settings persist automatically across sessions.</span>
				<button
					onclick={onClose}
					class="px-5 py-2 rounded-xl bg-neutral-100 text-neutral-950 font-semibold hover:bg-white transition"
				>
					Done
				</button>
			</div>
		</div>
	</div>
{/if}
