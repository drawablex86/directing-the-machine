<script lang="ts">
	import { X, ShieldAlert, Sparkles, RefreshCw, EyeOff, RotateCcw, Target, Check } from '@lucide/svelte';
	import { practiceStore } from '$lib/state/practice.svelte';
	import LlmTriggerButton from '$lib/components/llm/LlmTriggerButton.svelte';
	import LlmCritiqueCard from '$lib/components/llm/LlmCritiqueCard.svelte';
	import { executePrompt } from '$lib/engine/prompt-registry';
	import type { CritiqueResult, LlmAction } from '$lib/types/llm-prompts';

	let { isOpen, onClose }: { isOpen: boolean; onClose: () => void } = $props();

	let selectedFailureType = $state<'output' | 'habit' | 'motivational' | 'decay'>('output');
	let symptomsText = $state('');
	let triageCritique = $state<CritiqueResult | null>(null);
	let isDiagnosing = $state(false);
	let triageSavedNotice = $state(false);

	async function runFailureTriage() {
		if (isDiagnosing || !symptomsText.trim()) return;
		isDiagnosing = true;
		try {
			const res = await executePrompt('failure-triage-diagnostic', {
				symptoms: symptomsText.trim(),
				recentContext: `Active Part ${practiceStore.activePart}, Week ${practiceStore.activeWeek}, Day ${practiceStore.activeDay}`
			});
			triageCritique = res;
			if (res.failureTriageDiagnostic?.primaryMode) {
				selectedFailureType = res.failureTriageDiagnostic.primaryMode;
			}
		} catch (err) {
			console.error('Failed to diagnose failure mode:', err);
		} finally {
			isDiagnosing = false;
		}
	}

	const triageActions: LlmAction[] = [
		{
			label: 'Commit Recovery Plan to Decision Log',
			primary: true,
			onClick: (result) => {
				if (result.failureTriageDiagnostic) {
					practiceStore.saveDecision({
						project: 'Failure Mode Triage (Appendix M)',
						decision: `Diagnosed ${result.failureTriageDiagnostic.primaryMode.toUpperCase()} Failure: ${result.failureTriageDiagnostic.immediateNextMove}`,
						highestUnresolvedLevel: 'Level 1 (Intent)',
						alternativesRejected: 'Continuing to push through exhaustion or applying lower-level tweaks to broken intent',
						justification: `${result.failureTriageDiagnostic.underlyingDynamic} | Protocol: ${result.failureTriageDiagnostic.prescribedProtocol.join('; ')}`,
						feedbackIncorporated: 'Studio Physician 4-Way Triage Diagnosis',
						refusals: 'Self-Blame & Unexamined Pushing'
					});
					triageSavedNotice = true;
					setTimeout(() => (triageSavedNotice = false), 3000);
				}
			}
		}
	];

	const failureModes = [
		{
			id: 'output',
			name: '1. Output Failure',
			subtitle: 'The artifact does not work',
			desc: 'The work fails to achieve its stated intention, but you still have energy and discipline.',
			protocol: [
				'Open the Top-Down Diagnostic Ladder (Appendix B). Do not optimize lower levels while higher levels are broken.',
				'Identify the highest unresolved level (Intent → Structure → Logic → Execution).',
				'Design the Smallest Meaningful Experiment: change one single variable and test.',
				'If you have re-briefed twice with no progress, execute Principled Abandonment.'
			]
		},
		{
			id: 'habit',
			name: '2. Habit Failure',
			subtitle: 'Skipped sessions for 2+ weeks',
			desc: 'Life or work disrupted your practice rhythm. You feel guilty or overwhelmed.',
			protocol: [
				'Do not scold yourself. Habit failure is an intensity mismatch, not a character flaw.',
				'Shrink session targets to 15-minute micro-drills for 7 consecutive days.',
				'Consider switching Intensity Path (Appendix O) from Full-Time to Extended (24w) or Distributed (48w).',
				'Activate Maintenance Mode (4h/w) if paid work is currently peaking.'
			]
		},
		{
			id: 'motivational',
			name: '3. Motivational Failure',
			subtitle: 'Going through the motions / hollow care',
			desc: 'You can generate outputs and fill logs, but you do not care about what you are making.',
			protocol: [
				'Enforce an immediate 7-Day Production Pause: lock all generation tools.',
				'Protect 60 minutes of Non-Instrumental Attention daily (no deliverables, no briefs).',
				'Inspect earlier Standing Inquiry entries to pinpoint where borrowed ambition crept in.',
				'Return to Module 2 Problem-Finding: find something you care about when nobody is watching.'
			]
		},
		{
			id: 'decay',
			name: '4. Log Decay',
			subtitle: 'Logging has become checkbox bureaucracy',
			desc: 'You are typing the same phrases, default confidence percentages, or spending more time logging than making.',
			protocol: [
				'Set a hard 10-minute timer for all logging views.',
				'Enforce one sentence per field maximum.',
				'Rotate log prompts: replace stale fields with new observational lenses.',
				'Remember: The document is not the practice. The practice is the practice.'
			]
		}
	];
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
		role="dialog"
		tabindex="-1"
		onkeydown={(e) => { if (e.key === 'Escape') onClose(); }}
	>
		<div class="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
			<!-- Header -->
			<div class="p-4 border-b border-neutral-800 flex items-center justify-between">
				<div class="flex items-center gap-2">
					<div class="p-1.5 rounded-lg bg-red-950/60 border border-red-800/60 text-red-400">
						<ShieldAlert class="w-5 h-5" />
					</div>
					<div>
						<h2 class="font-bold text-sm text-neutral-100">4-Way Failure Recovery Wizard</h2>
						<p class="text-xs text-neutral-400">Differentiate the problem: Output, Habit, Motivation, or Log Decay</p>
					</div>
				</div>
				<button
					type="button"
					onclick={onClose}
					class="p-2 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Intelligent Symptom Diagnosis Input -->
			<div class="p-3.5 bg-neutral-950 border-b border-neutral-800 space-y-2 text-xs">
				<div class="flex items-center justify-between">
					<label for="symptoms-input" class="font-bold text-neutral-200 flex items-center gap-1.5">
						<Sparkles class="w-3.5 h-3.5 text-amber-400" />
						<span>Intelligent Studio Triage (Describe what feels stuck or broken):</span>
					</label>
					<span class="text-[10px] text-neutral-500 font-mono">Appendix M Clinical Advisor</span>
				</div>
				<textarea
					id="symptoms-input"
					rows="2"
					bind:value={symptomsText}
					placeholder="e.g. 'I am generating dozens of images but none feel personal. I feel like I am just running an automated pipeline without real skin in the game...'"
					class="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-500 font-sans leading-relaxed"
				></textarea>

				<div class="flex items-center justify-between pt-1">
					{#if triageSavedNotice}
						<span class="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
							<Check class="w-3.5 h-3.5" />
							<span>Recovery plan committed to Decision Log!</span>
						</span>
					{:else}
						<span class="text-[10px] text-neutral-500 italic">Auto-detects Output, Habit, Motivation, or Log Decay</span>
					{/if}

					<LlmTriggerButton
						label="Diagnose Failure Mode & Prescribe Protocol"
						onclick={runFailureTriage}
						loading={isDiagnosing}
						disabled={!symptomsText.trim()}
						size="xs"
						title="Socratically maps your qualitative symptoms to one of the 4 canonical Appendix M failure modes"
					/>
				</div>

				{#if triageCritique?.failureTriageDiagnostic}
					{@const diag = triageCritique.failureTriageDiagnostic}
					<div class="mt-2 p-3 rounded-lg bg-neutral-900 border border-amber-500/30 space-y-2">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2">
								<span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500 text-neutral-950 font-bold">
									Diagnosed: {diag.primaryMode.toUpperCase()} FAILURE
								</span>
							</div>
						</div>
						<p class="text-[11px] text-neutral-300 leading-relaxed font-serif">
							{diag.underlyingDynamic}
						</p>
						<div class="p-2 rounded bg-amber-950/20 border border-amber-900/40 text-[11px] text-amber-300 font-semibold flex items-center gap-1.5">
							<Target class="w-3.5 h-3.5 text-amber-400 shrink-0" />
							<span>Immediate Action: {diag.immediateNextMove}</span>
						</div>
					</div>
				{/if}

				{#if triageCritique}
					<div class="pt-1">
						<LlmCritiqueCard
							result={triageCritique}
							onDismiss={() => (triageCritique = null)}
							actions={triageActions}
						/>
					</div>
				{/if}
			</div>

			<!-- Selector Tabs -->
			<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-neutral-950/60 border-b border-neutral-800">
				{#each failureModes as mode}
					<button
						type="button"
						onclick={() => selectedFailureType = mode.id as any}
						class="p-2.5 rounded-xl text-left border transition {selectedFailureType === mode.id ? 'bg-neutral-900 border-amber-500/60 text-neutral-100 shadow' : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'}"
					>
						<div class="text-xs font-semibold">{mode.name}</div>
						<div class="text-[10px] text-neutral-500 mt-0.5 truncate">{mode.subtitle}</div>
					</button>
				{/each}
			</div>

			<!-- Protocol Content -->
			<div class="p-5 overflow-y-auto space-y-4 flex-1">
				{#each failureModes as mode}
					{#if selectedFailureType === mode.id}
						<div>
							<h3 class="font-semibold text-sm text-neutral-200">{mode.name}: {mode.subtitle}</h3>
							<p class="text-xs text-neutral-400 mt-1 leading-relaxed bg-neutral-950 p-3 rounded-xl border border-neutral-800">
								{mode.desc}
							</p>

							<div class="mt-4">
								<h4 class="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Prescribed Recovery Protocol</h4>
								<ol class="space-y-2 text-xs text-neutral-300">
									{#each mode.protocol as step, idx}
										<li class="flex items-start gap-2.5 p-2 rounded-lg bg-neutral-950/40 border border-neutral-800/60">
											<span class="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
												{idx + 1}
											</span>
											<span class="leading-relaxed">{step}</span>
										</li>
									{/each}
								</ol>
							</div>

							{#if mode.id === 'habit'}
								<div class="mt-4 p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between gap-3">
									<div class="text-xs text-neutral-400">
										Switch intensity path to Extended (24w) or Distributed (48w)?
									</div>
									<button
										type="button"
										onclick={() => { practiceStore.intensityPath = 'extended-24w'; practiceStore.saveToStorage(); onClose(); }}
										class="px-3 py-1.5 rounded-lg text-xs bg-amber-500 text-neutral-950 font-semibold hover:bg-amber-400 transition"
									>
										Set Extended (24w)
									</button>
								</div>
							{/if}
						</div>
					{/if}
				{/each}
			</div>

			<!-- Footer -->
			<div class="p-4 bg-neutral-950 border-t border-neutral-800 flex justify-end">
				<button
					type="button"
					onclick={onClose}
					class="px-4 py-2 rounded-xl text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium transition"
				>
					Got It
				</button>
			</div>
		</div>
	</div>
{/if}
