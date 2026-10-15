<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import { Sparkles, Loader2, KeyRound, AlertCircle } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		loading?: boolean;
		disabled?: boolean;
		variant?: 'primary' | 'secondary' | 'subtle' | 'outline';
		size?: 'xs' | 'sm' | 'md';
		icon?: any;
		title?: string;
		onclick?: () => void | Promise<void>;
		onOpenSettings?: () => void;
		children?: Snippet;
	}

	let {
		label,
		loading = false,
		disabled = false,
		variant = 'primary',
		size = 'sm',
		icon: CustomIcon,
		title,
		onclick,
		onOpenSettings,
		children
	}: Props = $props();

	let isConfigured = $derived(practiceStore.isByokConfigured);
	let activeModel = $derived(practiceStore.activeModelName);
	let showKeyHelp = $state(false);

	function handleClick(e: MouseEvent) {
		if (loading || disabled) return;

		if (!isConfigured) {
			e.preventDefault();
			e.stopPropagation();
			showKeyHelp = !showKeyHelp;
			if (onOpenSettings) {
				onOpenSettings();
			}
			return;
		}

		if (onclick) {
			onclick();
		}
	}

	// Variant styling
	const variantClasses = {
		primary:
			'bg-amber-500 text-neutral-950 hover:bg-amber-400 font-semibold shadow-sm border border-amber-400/40 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:border-neutral-800',
		secondary:
			'bg-neutral-800 text-neutral-100 hover:bg-neutral-700 border border-neutral-700/80 font-medium disabled:opacity-50',
		subtle:
			'bg-transparent text-neutral-300 hover:text-amber-400 hover:bg-neutral-800/60 font-medium disabled:opacity-40',
		outline:
			'bg-neutral-900/50 border border-neutral-700 text-neutral-300 hover:border-amber-500/60 hover:text-amber-400 font-medium disabled:opacity-40'
	};

	// Size styling
	const sizeClasses = {
		xs: 'text-[11px] px-2 py-1 gap-1.5 rounded-lg',
		sm: 'text-xs px-3 py-1.5 gap-2 rounded-xl',
		md: 'text-sm px-4 py-2 gap-2.5 rounded-xl'
	};
</script>

<div class="relative inline-flex items-center">
	<button
		type="button"
		{onclick}
		disabled={disabled || loading}
		aria-busy={loading}
		title={title || (isConfigured ? `Run calibrated critique with ${activeModel}` : 'API Key required (open Settings)')}
		class="inline-flex items-center justify-center transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 {sizeClasses[size]} {variantClasses[variant]}"
	>
		{#if loading}
			<Loader2 class="w-3.5 h-3.5 animate-spin shrink-0 text-current" />
			<span>{label}...</span>
		{:else}
			{#if CustomIcon}
				<CustomIcon class="w-3.5 h-3.5 shrink-0" />
			{:else}
				<Sparkles class="w-3.5 h-3.5 shrink-0 {isConfigured ? 'text-amber-400' : 'text-neutral-500'}" />
			{/if}
			<span>{label}</span>

			{#if !isConfigured}
				<span
					class="inline-flex items-center gap-0.5 ml-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-neutral-900 text-amber-400 border border-amber-500/30"
					title="API key needed"
				>
					<KeyRound class="w-2.5 h-2.5" />
					<span>KEY</span>
				</span>
			{/if}
		{/if}

		{#if children}
			{@render children()}
		{/if}
	</button>

	<!-- Unconfigured BYOK Prompt Popover -->
	{#if showKeyHelp && !isConfigured}
		<div
			class="absolute left-0 bottom-full mb-2 z-50 w-72 p-3 rounded-xl bg-neutral-900 border border-amber-500/40 text-neutral-100 shadow-xl space-y-2 text-xs animate-in fade-in zoom-in-95 duration-100"
		>
			<div class="flex items-start gap-2">
				<AlertCircle class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
				<div>
					<p class="font-bold text-amber-400">API Key Required</p>
					<p class="text-[11px] text-neutral-300 mt-0.5 leading-relaxed">
						To run this calibrated diagnostic critique, add your API key (OpenRouter, Gemini, OpenAI, Claude, or local Ollama) in Studio Settings.
					</p>
				</div>
			</div>
			<div class="flex items-center justify-between pt-1 border-t border-neutral-800">
				<a
					href="/app?tab=settings"
					class="font-mono text-[11px] text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2"
				>
					Configure in Settings →
				</a>
				<button
					type="button"
					onclick={(e) => { e.stopPropagation(); showKeyHelp = false; }}
					class="text-[10px] text-neutral-400 hover:text-neutral-200 px-1.5 py-0.5 rounded hover:bg-neutral-800"
				>
					Dismiss
				</button>
			</div>
		</div>
	{/if}
</div>
