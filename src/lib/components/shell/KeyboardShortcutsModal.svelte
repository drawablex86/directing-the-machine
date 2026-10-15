<script lang="ts">
	import { X, Keyboard, Command } from '@lucide/svelte';

	let { isOpen, onClose }: { isOpen: boolean; onClose: () => void } = $props();

	const shortcuts = [
		{ key: '? / H', desc: 'Open Course & Studio Help Encyclopedia (Ladders, Linter, Concepts)' },
		{ key: 'Cmd/Ctrl + K', desc: 'Open Appendix Just-In-Time Reference Drawer' },
		{ key: 'P / S', desc: 'Open Studio Settings & BYOK Inference Configuration' },
		{ key: 'F', desc: 'Toggle Single-Task Horizon (Focus Mode)' },
		{ key: 'Esc', desc: 'Close any active modal or drawer' },
		{ key: 'Tab', desc: 'Navigate between interactive controls and buttons' },
		{ key: 'Enter / Space', desc: 'Activate selected button or start/pause timer' }
	];
</script>

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
		aria-labelledby="shortcuts-modal-title"
	>
		<div class="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
			<div class="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
						<Keyboard class="w-5 h-5" />
					</div>
					<div>
						<h2 id="shortcuts-modal-title" class="text-base font-bold text-neutral-100">
							Keyboard Navigation & Shortcuts
						</h2>
						<p class="text-xs text-neutral-400">Navigate the studio hands-free with rapid keystrokes.</p>
					</div>
				</div>
				<button
					onclick={onClose}
					class="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-xl transition"
					aria-label="Close shortcuts"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<div class="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
				{#each shortcuts as item}
					<div class="flex items-center justify-between p-3 rounded-2xl bg-neutral-950/60 border border-neutral-800/80">
						<span class="text-xs text-neutral-300 font-medium">{item.desc}</span>
						<kbd class="px-2.5 py-1 text-xs font-mono font-semibold bg-neutral-800 text-amber-300 border border-neutral-700 rounded-lg shadow-inner">
							{item.key}
						</kbd>
					</div>
				{/each}
			</div>

			<div class="px-6 py-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between text-xs text-neutral-400">
				<span>Press <kbd class="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200">Esc</kbd> anytime to dismiss.</span>
				<button
					onclick={onClose}
					class="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold transition"
				>
					Got it
				</button>
			</div>
		</div>
	</div>
{/if}
