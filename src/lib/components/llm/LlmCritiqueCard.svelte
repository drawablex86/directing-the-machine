<script lang="ts">
	import type { CritiqueResult, LlmAction } from '$lib/types/llm-prompts';
	import { renderMarkdownReading } from '$lib/engine/markdown-renderer';
	import {
		Sparkles,
		Copy,
		Check,
		X,
		RotateCcw,
		AlertTriangle,
		Bot,
		Clock,
		Layers,
		CheckCircle2
	} from '@lucide/svelte';

	interface Props {
		result: CritiqueResult | null;
		loading?: boolean;
		error?: string | null;
		title?: string;
		actions?: LlmAction[];
		onDismiss?: () => void;
		onRetry?: () => void;
	}

	let {
		result,
		loading = false,
		error = null,
		title,
		actions = [],
		onDismiss,
		onRetry
	}: Props = $props();

	let copied = $state(false);
	let actionSuccessNotice = $state<string | null>(null);

	let rendered = $derived.by(() => {
		if (!result?.rawText) return { html: '', wordCount: 0 };
		return renderMarkdownReading(result.rawText);
	});

	async function copyToClipboard() {
		if (!result?.rawText) return;
		try {
			await navigator.clipboard.writeText(result.rawText);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (e) {
			console.error('Failed to copy', e);
		}
	}

	async function handleActionClick(action: LlmAction) {
		if (!result) return;
		try {
			await action.onClick(result);
			actionSuccessNotice = `Applied: ${action.label}`;
			setTimeout(() => {
				actionSuccessNotice = null;
			}, 3000);
		} catch (e: any) {
			console.error('Action failed', e);
		}
	}
</script>

{#if loading}
	<div
		class="p-5 rounded-2xl bg-neutral-900/90 border border-amber-500/30 text-neutral-200 space-y-3 animate-in fade-in duration-200 shadow-lg"
		role="status"
		aria-live="polite"
	>
		<div class="flex items-center justify-between border-b border-neutral-800 pb-3">
			<div class="flex items-center gap-2">
				<div class="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
					<Sparkles class="w-4 h-4 animate-spin" />
				</div>
				<div>
					<p class="text-xs font-bold text-neutral-100">
						{title || 'Diagnostic Interlocutor Analyzing'}...
					</p>
					<p class="text-[11px] text-neutral-400">
						Cross-examining against course standards & zero-adjective discipline
					</p>
				</div>
			</div>
			<span class="text-[11px] font-mono text-amber-400/80 animate-pulse">Running inference</span>
		</div>

		<!-- Skeleton pulse -->
		<div class="space-y-2 pt-1">
			<div class="h-3.5 bg-neutral-800/80 rounded w-3/4 animate-pulse"></div>
			<div class="h-3 bg-neutral-800/60 rounded w-full animate-pulse"></div>
			<div class="h-3 bg-neutral-800/60 rounded w-5/6 animate-pulse"></div>
			<div class="h-3 bg-neutral-800/40 rounded w-2/3 animate-pulse"></div>
		</div>
	</div>
{:else if error}
	<div
		class="p-5 rounded-2xl bg-neutral-950 border border-red-800/60 text-neutral-200 space-y-3 shadow-lg animate-in fade-in duration-150"
		role="alert"
	>
		<div class="flex items-start justify-between gap-3">
			<div class="flex items-start gap-2.5">
				<div class="p-1.5 rounded-lg bg-red-950/60 border border-red-800 text-red-400 shrink-0 mt-0.5">
					<AlertTriangle class="w-4 h-4" />
				</div>
				<div class="space-y-1">
					<p class="text-xs font-bold text-red-300">Critique Engine Error</p>
					<p class="text-xs text-neutral-300 font-mono break-all leading-relaxed">{error}</p>
				</div>
			</div>

			{#if onDismiss}
				<button
					type="button"
					onclick={onDismiss}
					aria-label="Dismiss error"
					class="text-neutral-500 hover:text-neutral-200 p-1 rounded-lg hover:bg-neutral-800 transition"
				>
					<X class="w-4 h-4" />
				</button>
			{/if}
		</div>

		<div class="flex items-center justify-between pt-2 border-t border-neutral-900 text-xs">
			<a
				href="/app?tab=settings"
				class="text-[11px] text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2"
			>
				Check API Keys in Settings →
			</a>
			{#if onRetry}
				<button
					type="button"
					onclick={onRetry}
					class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition cursor-pointer"
				>
					<RotateCcw class="w-3.5 h-3.5" />
					<span>Retry</span>
				</button>
			{/if}
		</div>
	</div>
{:else if result}
	<div
		class="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-100 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
	>
		<!-- Header Metadata Bar -->
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-neutral-800 pb-3">
			<div class="flex items-center gap-2 flex-wrap">
				<div class="p-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
					<Bot class="w-4 h-4" />
				</div>
				<div class="flex items-center gap-2">
					<span class="text-xs font-bold text-white">
						{title || result.persona}
					</span>
					<span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400">
						{result.provider}
					</span>
				</div>
			</div>

			<div class="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
				<span title="Inference Latency" class="inline-flex items-center gap-1 text-neutral-400">
					<Clock class="w-3 h-3 text-neutral-500" />
					<span>{result.latencyMs}ms</span>
				</span>
				<span class="text-neutral-700">•</span>
				<span title="Model" class="text-neutral-300 max-w-[140px] truncate">
					{result.model}
				</span>

				{#if onDismiss}
					<button
						type="button"
						onclick={onDismiss}
						aria-label="Dismiss critique"
						class="text-neutral-500 hover:text-neutral-200 p-1 ml-1 rounded-lg hover:bg-neutral-800 transition cursor-pointer"
					>
						<X class="w-3.5 h-3.5" />
					</button>
				{/if}
			</div>
		</div>

		<!-- Action Success Notification -->
		{#if actionSuccessNotice}
			<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs">
				<CheckCircle2 class="w-3.5 h-3.5 shrink-0" />
				<span>{actionSuccessNotice}</span>
			</div>
		{/if}

		<!-- Markdown Content Area -->
		<div class="prose prose-invert prose-xs max-w-none text-neutral-200 leading-relaxed font-sans selection:bg-amber-500/20 selection:text-amber-200 space-y-2">
			{@html rendered.html}
		</div>

		<!-- Action Buttons Footer -->
		<div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-neutral-800/80">
			<!-- Custom Domain Action Buttons -->
			<div class="flex flex-wrap items-center gap-2">
				{#each actions as action}
					<button
						type="button"
						disabled={action.disabled}
						onclick={() => handleActionClick(action)}
						class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer {action.primary
							? 'bg-amber-500 text-neutral-950 hover:bg-amber-400 shadow-sm'
							: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700'}"
					>
						{#if action.icon}
							<action.icon class="w-3.5 h-3.5" />
						{/if}
						<span>{action.label}</span>
					</button>
				{/each}
			</div>

			<!-- Universal Utility Actions (Copy, Re-run) -->
			<div class="flex items-center gap-1.5 ml-auto">
				<button
					type="button"
					onclick={copyToClipboard}
					class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 text-xs font-mono transition cursor-pointer"
					title="Copy critique text as Markdown"
				>
					{#if copied}
						<Check class="w-3.5 h-3.5 text-emerald-400" />
						<span class="text-emerald-400 font-bold">Copied</span>
					{:else}
						<Copy class="w-3.5 h-3.5" />
						<span>Copy</span>
					{/if}
				</button>

				{#if onRetry}
					<button
						type="button"
						onclick={onRetry}
						class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 text-xs font-mono transition cursor-pointer"
						title="Re-run critique"
					>
						<RotateCcw class="w-3.5 h-3.5" />
						<span>Re-run</span>
					</button>
				{/if}
			</div>
		</div>
	</div>
{/if}
