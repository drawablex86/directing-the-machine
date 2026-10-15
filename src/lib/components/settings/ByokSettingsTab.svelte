<script lang="ts">
	import { practiceStore } from '$lib/state/practice.svelte';
	import {
		PROVIDER_METAS,
		fetchAvailableModels,
		testInferenceConnection
	} from '$lib/engine/inference';
	import type { InferenceProviderId, ModelOption } from '$lib/types/inference';
	import {
		Cpu,
		Key,
		Eye,
		EyeOff,
		RefreshCw,
		Search,
		Check,
		ExternalLink,
		Zap,
		ShieldCheck,
		Trash2,
		TriangleAlert,
		Sparkles,
		Terminal,
		Sliders,
		CheckCircle2,
		Info
	} from '@lucide/svelte';

	// The provider currently being viewed/edited in the UI
	let viewedProvider = $state<InferenceProviderId>(practiceStore.byokSettings.activeProvider);

	let showApiKey = $state(false);
	let modelSearch = $state('');
	let isCustomModelMode = $state(false);
	let customModelInput = $state('');

	// Fetch models state
	let isFetchingModels = $state(false);
	let fetchError = $state('');
	let fetchSuccess = $state('');

	// Connection test state
	let isTesting = $state(false);
	let testResult = $state<{
		success: boolean;
		latencyMs: number;
		message: string;
		model: string;
	} | null>(null);

	const providerMeta = $derived(PROVIDER_METAS[viewedProvider]);
	const currentConfig = $derived(practiceStore.byokSettings.providers[viewedProvider]);
	const isActiveStudioEngine = $derived(practiceStore.byokSettings.activeProvider === viewedProvider);

	let onlyFreeModels = $state(false);

	const filteredModels = $derived.by<ModelOption[]>(() => {
		const models = currentConfig?.availableModels || [];
		let list = models;
		if (onlyFreeModels) {
			list = list.filter((m) => m.isFree || m.id.includes(':free') || m.pricing?.prompt?.includes('$0.00'));
		}
		const q = modelSearch.trim().toLowerCase();
		if (!q) return list;
		return list.filter(
			(m) => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q) || (m.description && m.description.toLowerCase().includes(q))
		);
	});

	function selectProvider(pId: InferenceProviderId) {
		viewedProvider = pId;
		showApiKey = false;
		modelSearch = '';
		isCustomModelMode = false;
		fetchError = '';
		fetchSuccess = '';
		testResult = null;
	}

	function setAsActiveStudioEngine() {
		practiceStore.setByokProvider(viewedProvider);
	}

	function handleApiKeyChange(val: string) {
		practiceStore.updateByokConfig(viewedProvider, { apiKey: val });
		testResult = null;
	}

	function handleBaseUrlChange(val: string) {
		practiceStore.updateByokConfig(viewedProvider, { baseUrl: val });
		testResult = null;
	}

	function resetBaseUrl() {
		practiceStore.updateByokConfig(viewedProvider, { baseUrl: providerMeta.defaultBaseUrl });
		testResult = null;
	}

	function handleSelectModel(modelId: string) {
		practiceStore.updateByokConfig(viewedProvider, { selectedModel: modelId });
		testResult = null;
	}

	function handleApplyCustomModel() {
		const trimmed = customModelInput.trim();
		if (!trimmed) return;
		// Add to availableModels if not already there
		const exists = currentConfig.availableModels.some((m) => m.id === trimmed);
		if (!exists) {
			const updated = [{ id: trimmed, name: trimmed, description: 'Custom model ID' }, ...currentConfig.availableModels];
			practiceStore.updateByokConfig(viewedProvider, {
				availableModels: updated,
				selectedModel: trimmed
			});
		} else {
			practiceStore.updateByokConfig(viewedProvider, { selectedModel: trimmed });
		}
		isCustomModelMode = false;
		customModelInput = '';
		testResult = null;
	}

	function clearKey() {
		practiceStore.clearByokKey(viewedProvider);
		testResult = null;
		fetchSuccess = '';
		fetchError = '';
	}

	async function handleFetchModels() {
		isFetchingModels = true;
		fetchError = '';
		fetchSuccess = '';
		testResult = null;

		try {
			const models = await fetchAvailableModels(
				viewedProvider,
				currentConfig.apiKey,
				currentConfig.baseUrl
			);
			practiceStore.updateByokConfig(viewedProvider, {
				availableModels: models,
				lastFetchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
			});

			// If current selectedModel is not in fetched models, keep it or switch to first
			const currentSelected = currentConfig.selectedModel;
			const found = models.some((m) => m.id === currentSelected);
			if (!found && models.length > 0) {
				practiceStore.updateByokConfig(viewedProvider, { selectedModel: models[0].id });
			}

			fetchSuccess = `Successfully fetched ${models.length} models for ${providerMeta.name}.`;
		} catch (err: any) {
			fetchError = err?.message || 'Failed to fetch models from endpoint.';
		} finally {
			isFetchingModels = false;
		}
	}

	async function handleTestConnection() {
		isTesting = true;
		testResult = null;

		try {
			const res = await testInferenceConnection(viewedProvider, currentConfig);
			testResult = res;
		} catch (err: any) {
			testResult = {
				success: false,
				latencyMs: 0,
				message: err?.message || 'Inference test failed.',
				model: currentConfig.selectedModel
			};
		} finally {
			isTesting = false;
		}
	}
</script>

<div class="space-y-6">
	<!-- Top Privacy Guarantee & Active Engine HUD -->
	<div class="bg-neutral-950/70 border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
		<div class="flex items-center gap-3">
			<div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 shrink-0">
				<ShieldCheck class="w-5 h-5" />
			</div>
			<div>
				<div class="flex items-center gap-2">
					<span class="text-xs font-bold text-neutral-100">100% Client-Side Local-First Inference</span>
					<span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Zero Intermediary</span>
				</div>
				<p class="text-[11px] text-neutral-400">
					API keys are stored exclusively in your browser (<code class="text-neutral-300">localStorage</code>) and never touch our servers.
				</p>
			</div>
		</div>

		<!-- Current Active Engine Pill -->
		<div class="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
			<span class="text-neutral-500 font-mono text-[10px] uppercase tracking-wider">Active:</span>
			<span class="font-bold text-amber-400">{PROVIDER_METAS[practiceStore.byokSettings.activeProvider].name}</span>
			<span class="text-neutral-600">/</span>
			<span class="font-mono text-[11px] text-neutral-300 truncate max-w-[160px]">
				{practiceStore.byokSettings.providers[practiceStore.byokSettings.activeProvider].selectedModel}
			</span>
		</div>
	</div>

	<!-- Provider Selection Tabs -->
	<div class="space-y-2">
		<label for="provider-tabs" class="text-xs font-semibold text-neutral-300 flex items-center justify-between">
			<span>Select Provider / Gateway</span>
			<span class="text-[11px] text-neutral-500 font-normal">Switch tabs to configure credentials</span>
		</label>
		<div id="provider-tabs" class="grid grid-cols-2 sm:grid-cols-5 gap-2" role="tablist">
			{#each (['openrouter', 'openai', 'google', 'anthropic', 'custom'] as InferenceProviderId[]) as pId}
				{@const meta = PROVIDER_METAS[pId]}
				{@const hasKey = pId === 'custom' || Boolean(practiceStore.byokSettings.providers[pId]?.apiKey?.trim())}
				{@const isActive = practiceStore.byokSettings.activeProvider === pId}
				{@const isSelected = viewedProvider === pId}

				<button
					type="button"
					onclick={() => selectProvider(pId)}
					class="p-2.5 rounded-xl text-left border transition relative flex flex-col justify-between gap-1.5 cursor-pointer {isSelected
						? 'bg-neutral-800/90 border-amber-500/60 shadow-lg shadow-amber-500/5'
						: 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850'}"
					role="tab"
					aria-selected={isSelected}
				>
					<div class="flex items-center justify-between w-full">
						<span class="text-xs font-bold text-neutral-100 flex items-center gap-1.5">
							{#if pId === 'openrouter'}
								<Sparkles class="w-3.5 h-3.5 text-amber-400 shrink-0" />
							{:else if pId === 'google'}
								<Zap class="w-3.5 h-3.5 text-amber-400 shrink-0" />
							{:else if pId === 'custom'}
								<Terminal class="w-3.5 h-3.5 text-amber-400 shrink-0" />
							{:else}
								<Cpu class="w-3.5 h-3.5 text-amber-400 shrink-0" />
							{/if}
							<span>{meta.name}</span>
						</span>
						{#if isActive}
							<span class="w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400" title="Active Studio Engine"></span>
						{:else if hasKey}
							<span class="w-1.5 h-1.5 rounded-full bg-emerald-400" title="API Key Configured"></span>
						{/if}
					</div>

					<div class="flex items-center justify-between text-[10px]">
						<span class="text-neutral-400 font-mono">
							{#if isActive}
								<span class="text-amber-400 font-semibold">Active</span>
							{:else if hasKey}
								<span class="text-emerald-400">Ready</span>
							{:else}
								<span class="text-neutral-500">Unconfigured</span>
							{/if}
						</span>
						{#if meta.badge && pId === 'openrouter'}
							<span class="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">Default</span>
						{/if}
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Provider Header Card with Action to Set Active -->
	<div class="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4.5 space-y-4">
		<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-3.5">
			<div>
				<div class="flex items-center gap-2">
					<h3 class="text-sm font-bold text-neutral-100 flex items-center gap-2">
						{providerMeta.name}
					</h3>
					{#if providerMeta.badge}
						<span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
							{providerMeta.badge}
						</span>
					{/if}
				</div>
				<p class="text-xs text-neutral-400 mt-1 max-w-xl">
					{providerMeta.description}
				</p>
			</div>

			<div class="flex items-center gap-2 shrink-0">
				{#if !isActiveStudioEngine}
					<button
						type="button"
						onclick={setAsActiveStudioEngine}
						class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition flex items-center gap-1.5 shadow"
					>
						<Check class="w-3.5 h-3.5" />
						<span>Set as Active Engine</span>
					</button>
				{:else}
					<div class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
						<CheckCircle2 class="w-3.5 h-3.5 text-emerald-400" />
						<span>Active Studio Engine</span>
					</div>
				{/if}

				<a
					href={providerMeta.keyHelpUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="px-3 py-1.5 rounded-xl text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 transition flex items-center gap-1.5"
				>
					<span>Get Key</span>
					<ExternalLink class="w-3 h-3 text-neutral-400" />
				</a>
			</div>
		</div>

		<!-- Credentials Form -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<!-- API Key Input -->
			<div class="space-y-1.5">
				<div class="flex items-center justify-between">
					<label for="byok-api-key" class="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
						<Key class="w-3.5 h-3.5 text-amber-400" />
						<span>API Key</span>
					</label>
					{#if currentConfig.apiKey}
						<button
							type="button"
							onclick={clearKey}
							class="text-[11px] text-neutral-400 hover:text-red-400 flex items-center gap-1 transition cursor-pointer"
						>
							<Trash2 class="w-3 h-3" />
							<span>Remove Key</span>
						</button>
					{/if}
				</div>
				<div class="relative">
					<input
						id="byok-api-key"
						type={showApiKey ? 'text' : 'password'}
						value={currentConfig.apiKey}
						oninput={(e) => handleApiKeyChange((e.target as HTMLInputElement).value)}
						placeholder={providerMeta.keyPlaceholder}
						autocomplete="off"
						spellcheck="false"
						class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 font-mono pr-10 transition"
					/>
					<button
						type="button"
						onclick={() => (showApiKey = !showApiKey)}
						class="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition p-1 rounded"
						title={showApiKey ? 'Hide API key' : 'Show API key'}
					>
						{#if showApiKey}
							<EyeOff class="w-3.5 h-3.5" />
						{:else}
							<Eye class="w-3.5 h-3.5" />
						{/if}
					</button>
				</div>
				<p class="text-[11px] text-neutral-500">
					{providerMeta.keyHelpText}
				</p>
			</div>

			<!-- Base URL Input -->
			<div class="space-y-1.5">
				<div class="flex items-center justify-between">
					<label for="byok-base-url" class="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
						<Sliders class="w-3.5 h-3.5 text-neutral-400" />
						<span>Base URL / Endpoint</span>
					</label>
					{#if currentConfig.baseUrl && currentConfig.baseUrl !== providerMeta.defaultBaseUrl}
						<button
							type="button"
							onclick={resetBaseUrl}
							class="text-[11px] text-neutral-400 hover:text-amber-400 transition cursor-pointer"
						>
							Reset Default
						</button>
					{/if}
				</div>
				<input
					id="byok-base-url"
					type="text"
					value={currentConfig.baseUrl || providerMeta.defaultBaseUrl}
					oninput={(e) => handleBaseUrlChange((e.target as HTMLInputElement).value)}
					placeholder={providerMeta.defaultBaseUrl}
					autocomplete="off"
					spellcheck="false"
					class="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 font-mono transition"
				/>
				<p class="text-[11px] text-neutral-500">
					Default: <code class="text-neutral-400">{providerMeta.defaultBaseUrl}</code>
				</p>
			</div>
		</div>

		<!-- Model Selection & Live Fetch Section -->
		<div class="border-t border-neutral-800/80 pt-4 space-y-3">
			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
				<div class="flex items-center gap-2">
					<span class="text-xs font-semibold text-neutral-200">Active Model for {providerMeta.name}</span>
					<span class="text-[11px] text-neutral-400 font-mono">
						({currentConfig.availableModels.length} {currentConfig.availableModels.length === 1 ? 'model' : 'models'} configured)
					</span>
					{#if currentConfig.lastFetchedAt}
						<span class="text-[10px] text-neutral-500 font-mono">· Fetched {currentConfig.lastFetchedAt}</span>
					{/if}
				</div>

				<div class="flex items-center gap-2 w-full sm:w-auto">
					<!-- Fetch Models Button -->
					<button
						type="button"
						onclick={handleFetchModels}
						disabled={isFetchingModels}
						class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-neutral-200 hover:text-white transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
						title="Fetch available models from endpoint using API key"
					>
						<RefreshCw class="w-3.5 h-3.5 text-amber-400 {isFetchingModels ? 'animate-spin' : ''}" />
						<span>{isFetchingModels ? 'Fetching Models...' : 'Fetch Models'}</span>
					</button>

					<!-- Manual Model Input Toggle -->
					<button
						type="button"
						onclick={() => (isCustomModelMode = !isCustomModelMode)}
						class="px-3 py-1.5 rounded-xl text-xs border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-200 transition"
					>
						{isCustomModelMode ? 'Use List' : 'Custom ID'}
					</button>
				</div>
			</div>

			<!-- Fetch feedback alerts -->
			{#if fetchSuccess}
				<div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2">
					<CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
					<span>{fetchSuccess}</span>
				</div>
			{:else if fetchError}
				<div class="p-2.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs flex items-center gap-2">
					<TriangleAlert class="w-4 h-4 text-red-400 shrink-0" />
					<span>{fetchError}</span>
				</div>
			{/if}

			{#if isCustomModelMode}
				<!-- Manual Custom Model Input -->
				<div class="p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
					<span class="text-xs text-neutral-300 font-medium block">Enter Model Identifier</span>
					<div class="flex items-center gap-2">
						<input
							type="text"
							bind:value={customModelInput}
							placeholder="e.g. anthropic/claude-3.5-sonnet:beta or ft:gpt-4o:..."
							class="flex-1 bg-neutral-900 border border-neutral-750 rounded-xl px-3 py-2 text-xs font-mono text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
						/>
						<button
							type="button"
							onclick={handleApplyCustomModel}
							class="px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-neutral-950 hover:bg-amber-400 transition"
						>
							Apply Model
						</button>
					</div>
					<p class="text-[11px] text-neutral-500">
						Useful for newly released models, private fine-tunes, or local custom quantized weights.
					</p>
				</div>
			{:else}
				<!-- Search Filter Input & Free Filter -->
				<div class="space-y-2">
					<div class="flex items-center justify-between gap-2">
						<div class="relative flex-1">
							<Search class="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
							<input
								type="text"
								bind:value={modelSearch}
								placeholder="Search models by name or id (e.g. nemotron, llama, flash, claude)..."
								class="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
							/>
							{#if modelSearch}
								<button
									type="button"
									onclick={() => (modelSearch = '')}
									class="text-[11px] text-neutral-500 hover:text-neutral-300 absolute right-3 top-1/2 -translate-y-1/2"
								>
									Clear
								</button>
							{/if}
						</div>

						<!-- Free Models Toggle Pill -->
						<button
							type="button"
							onclick={() => (onlyFreeModels = !onlyFreeModels)}
							class="px-2.5 py-2 rounded-xl text-xs font-mono font-semibold transition shrink-0 flex items-center gap-1.5 cursor-pointer {onlyFreeModels
								? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700 shadow-sm'
								: 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200'}"
							title="Filter to free-to-use models (e.g. NVIDIA Nemotron, Llama Free)"
						>
							<span>Free Models 🎁</span>
						</button>
					</div>

					<!-- Model Cards Grid -->
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
						{#each filteredModels as model}
							{@const isSelected = currentConfig.selectedModel === model.id}
							{@const isFreeModel = model.isFree || model.id.includes(':free') || model.pricing?.prompt?.includes('$0.00')}
							<button
								type="button"
								onclick={() => handleSelectModel(model.id)}
								class="p-2.5 rounded-xl border text-left transition flex items-start justify-between gap-2 cursor-pointer {isSelected
									? 'bg-amber-500/10 border-amber-500/50 text-neutral-100'
									: 'bg-neutral-950/70 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/60 text-neutral-300'}"
							>
								<div class="space-y-1 min-w-0">
									<div class="flex items-center gap-1.5 flex-wrap">
										<span class="text-xs font-semibold truncate {isSelected ? 'text-amber-400' : 'text-neutral-200'}">
											{model.name}
										</span>
										{#if isFreeModel}
											<span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-bold">
												FREE
											</span>
										{/if}
										{#if model.contextLength}
											<span class="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
												{model.contextLength >= 1000000
													? `${(model.contextLength / 1000000).toFixed(1)}M`
													: `${Math.round(model.contextLength / 1000)}k`}
											</span>
										{/if}
										{#if model.pricing?.prompt && !isFreeModel}
											<span class="text-[9px] font-mono text-neutral-500">
												{model.pricing.prompt}
											</span>
										{/if}
									</div>
									<div class="text-[10px] font-mono text-neutral-500 truncate">
										{model.id}
									</div>
									{#if model.description}
										<p class="text-[11px] text-neutral-400 line-clamp-1">
											{model.description}
										</p>
									{/if}
								</div>

								{#if isSelected}
									<div class="w-4 h-4 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shrink-0 mt-0.5">
										<Check class="w-2.5 h-2.5 stroke-[3]" />
									</div>
								{/if}
							</button>
						{/each}

						{#if filteredModels.length === 0}
							<div class="col-span-full py-6 text-center text-xs text-neutral-500">
								No models match "{modelSearch}". Click <button type="button" onclick={() => (isCustomModelMode = true)} class="text-amber-400 hover:underline">enter custom ID</button> or click "Fetch Models".
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>

		<!-- End-to-End Latency & Ping Tester -->
		<div class="border-t border-neutral-800/80 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
			<div class="space-y-0.5">
				<span class="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
					<Zap class="w-3.5 h-3.5 text-amber-400" />
					<span>End-to-End Latency & Connectivity Test</span>
				</span>
				<p class="text-[11px] text-neutral-400">
					Sends a test ping to <code class="text-neutral-300 font-mono">{currentConfig.selectedModel}</code> to measure round-trip latency.
				</p>
			</div>

			<button
				type="button"
				onclick={handleTestConnection}
				disabled={isTesting}
				class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-neutral-100 hover:text-white transition flex items-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
			>
				{#if isTesting}
					<RefreshCw class="w-3.5 h-3.5 animate-spin text-amber-400" />
					<span>Pinging Endpoint...</span>
				{:else}
					<Zap class="w-3.5 h-3.5 text-amber-400" />
					<span>Test Connection</span>
				{/if}
			</button>
		</div>

		<!-- Latency test results display -->
		{#if testResult}
			{#if testResult.success}
				<div class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 space-y-1">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2 font-semibold">
							<CheckCircle2 class="w-4 h-4 text-emerald-400" />
							<span>Connection Verified Successfully</span>
						</div>
						<span class="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
							{testResult.latencyMs}ms latency
						</span>
					</div>
					<div class="text-[11px] text-emerald-300/80 font-mono pl-6">
						Model "{testResult.model}" responded: "{testResult.message}"
					</div>
				</div>
			{:else}
				<div class="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-200 space-y-1">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2 font-semibold">
							<TriangleAlert class="w-4 h-4 text-red-400" />
							<span>Connection Failed</span>
						</div>
						{#if testResult.latencyMs > 0}
							<span class="font-mono text-[11px] text-red-400">
								Timed out after {testResult.latencyMs}ms
							</span>
						{/if}
					</div>
					<div class="text-[11px] text-red-300 font-mono pl-6">
						{testResult.message}
					</div>
					<p class="text-[11px] text-neutral-400 pl-6 pt-1">
						Troubleshooting: Check that your API key is valid, your account has sufficient credits, and the model name is spelled correctly.
					</p>
				</div>
			{/if}
		{/if}
	</div>
</div>
