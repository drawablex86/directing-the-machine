import type {
	InferenceProviderId,
	ModelOption,
	ProviderConfig,
	ProviderMeta,
	InferenceRequest,
	InferenceResponse
} from '../types/inference';
import { practiceStore } from '../state/practice.svelte';

export const PROVIDER_METAS: Record<InferenceProviderId, ProviderMeta> = {
	openrouter: {
		id: 'openrouter',
		name: 'OpenRouter',
		badge: 'Recommended · All Models',
		defaultBaseUrl: 'https://openrouter.ai/api/v1',
		defaultModel: 'anthropic/claude-3.5-sonnet',
		keyPlaceholder: 'sk-or-v1-...',
		keyHelpUrl: 'https://openrouter.ai/keys',
		keyHelpText: 'Access Claude, Gemini, GPT-4o, DeepSeek, and Llama with a single API key.',
		description: 'Unified inference gateway with unified billing, zero CORS restrictions, and access to all state-of-the-art models.',
		defaultModels: [
			{ id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', contextLength: 200000, description: 'Highest diagnostic vision & craft' },
			{ id: 'anthropic/claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', contextLength: 200000, description: 'Hybrid reasoning and direction' },
			{ id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', contextLength: 1048576, description: 'Ultra-fast low latency evaluation' },
			{ id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro', contextLength: 2097152, description: 'Massive context window & complex reasoning' },
			{ id: 'openai/gpt-4o', name: 'GPT-4o', contextLength: 128000, description: 'Flagship omni model' },
			{ id: 'deepseek/deepseek-chat', name: 'DeepSeek V3', contextLength: 64000, description: 'High capability open-weights reasoning' },
			{ id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B Instruct', contextLength: 131072, description: 'Leading open source model' }
		]
	},
	openai: {
		id: 'openai',
		name: 'OpenAI',
		defaultBaseUrl: 'https://api.openai.com/v1',
		defaultModel: 'gpt-4o',
		keyPlaceholder: 'sk-proj-... or sk-...',
		keyHelpUrl: 'https://platform.openai.com/api-keys',
		keyHelpText: 'Direct API key from the OpenAI developer platform.',
		description: 'Direct connection to OpenAI endpoints including GPT-4o, GPT-4o-mini, and reasoning models.',
		defaultModels: [
			{ id: 'gpt-4o', name: 'GPT-4o', contextLength: 128000, description: 'Versatile flagship model' },
			{ id: 'gpt-4o-mini', name: 'GPT-4o Mini', contextLength: 128000, description: 'Fast, lightweight evaluation' },
			{ id: 'o3-mini', name: 'o3-mini', contextLength: 200000, description: 'Efficient reasoning and synthesis' },
			{ id: 'o1', name: 'o1', contextLength: 200000, description: 'Deep reasoning model' },
			{ id: 'gpt-4-turbo', name: 'GPT-4 Turbo', contextLength: 128000, description: 'High capability legacy' }
		]
	},
	google: {
		id: 'google',
		name: 'Google Gemini',
		badge: 'Generous Free Tier',
		defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
		defaultModel: 'gemini-2.5-flash',
		keyPlaceholder: 'AIzaSy...',
		keyHelpUrl: 'https://aistudio.google.com/apikey',
		keyHelpText: 'Direct API key from Google AI Studio (includes generous free rate limits).',
		description: 'Direct connection to Google DeepMind Gemini models with up to 2M tokens context window.',
		defaultModels: [
			{ id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', contextLength: 1048576, description: 'Fast, balanced workhorse model' },
			{ id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', contextLength: 2097152, description: 'Maximum reasoning & long-context fidelity' },
			{ id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', contextLength: 1048576, description: 'Reliable fast multi-modal' },
			{ id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', contextLength: 2097152, description: 'Complex creative synthesis' }
		]
	},
	anthropic: {
		id: 'anthropic',
		name: 'Anthropic Claude',
		badge: 'Direct Claude',
		defaultBaseUrl: 'https://api.anthropic.com/v1',
		defaultModel: 'claude-3-7-sonnet-20250219',
		keyPlaceholder: 'sk-ant-...',
		keyHelpUrl: 'https://console.anthropic.com/settings/keys',
		keyHelpText: 'Direct API key from the Anthropic console.',
		description: 'Direct browser access to Claude models using client-side CORS authorization.',
		defaultModels: [
			{ id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet', contextLength: 200000, description: 'Latest hybrid thinking & direction' },
			{ id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', contextLength: 200000, description: 'Industry benchmark for nuance & code' },
			{ id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', contextLength: 200000, description: 'Ultra-fast critique & evaluation' },
			{ id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', contextLength: 200000, description: 'Deep philosophical reasoning' }
		]
	},
	custom: {
		id: 'custom',
		name: 'Custom OpenAI-Compatible',
		badge: 'Local / Ollama / Proxy',
		defaultBaseUrl: 'http://localhost:11434/v1',
		defaultModel: 'llama3.2',
		keyPlaceholder: 'Optional key (e.g. sk-local or sk-dummy)',
		keyHelpUrl: 'https://github.com/ollama/ollama',
		keyHelpText: 'Works with local Ollama, LM Studio, vLLM, LiteLLM, Groq, Together, or any OpenAI-compatible proxy.',
		description: 'Route requests through any local runner or proxy endpoint supporting standard OpenAI chat completions.',
		defaultModels: [
			{ id: 'llama3.2', name: 'Llama 3.2', description: 'Local lightweight model' },
			{ id: 'llama3.3:70b', name: 'Llama 3.3 70B', description: 'High capability local weights' },
			{ id: 'mistral', name: 'Mistral 7B', description: 'Fast local reasoning' },
			{ id: 'qwen2.5:32b', name: 'Qwen 2.5 32B', description: 'Strong instruction following' },
			{ id: 'deepseek-r1', name: 'DeepSeek R1', description: 'Local distilled reasoning' }
		]
	}
};

/**
 * Fetch available models from the provider endpoint using the supplied credentials.
 */
export async function fetchAvailableModels(
	provider: InferenceProviderId,
	apiKey: string,
	customBaseUrl?: string
): Promise<ModelOption[]> {
	const meta = PROVIDER_METAS[provider];
	const baseUrl = (customBaseUrl?.trim() || meta.defaultBaseUrl).replace(/\/+$/, '');

	if (provider === 'openrouter') {
		const headers: Record<string, string> = {
			'HTTP-Referer': 'https://directing-the-machine.vercel.app',
			'X-Title': 'Directing the Machine Studio'
		};
		if (apiKey.trim()) {
			headers['Authorization'] = `Bearer ${apiKey.trim()}`;
		}
		const res = await fetch(`${baseUrl}/models`, {
			method: 'GET',
			headers
		});
		if (!res.ok) {
			const errText = await res.text().catch(() => '');
			throw new Error(`OpenRouter models query failed (${res.status}): ${errText || res.statusText}`);
		}
		const data = await res.json();
		const list: any[] = Array.isArray(data?.data) ? data.data : [];
		if (list.length === 0) {
			return meta.defaultModels;
		}
		return list.map((item) => ({
			id: item.id,
			name: item.name || item.id,
			description: item.description || '',
			contextLength: item.context_length,
			pricing: item.pricing
				? {
						prompt: item.pricing.prompt ? `$${(Number(item.pricing.prompt) * 1000000).toFixed(2)}/M` : undefined,
						completion: item.pricing.completion ? `$${(Number(item.pricing.completion) * 1000000).toFixed(2)}/M` : undefined
					}
				: undefined
		}));
	}

	if (provider === 'openai' || provider === 'custom') {
		const headers: Record<string, string> = {};
		if (apiKey.trim()) {
			headers['Authorization'] = `Bearer ${apiKey.trim()}`;
		}
		const res = await fetch(`${baseUrl}/models`, {
			method: 'GET',
			headers
		});
		if (!res.ok) {
			const errText = await res.text().catch(() => '');
			throw new Error(`${meta.name} models query failed (${res.status}): ${errText || res.statusText}`);
		}
		const data = await res.json();
		const list: any[] = Array.isArray(data?.data) ? data.data : [];
		if (list.length === 0) {
			return meta.defaultModels;
		}

		// Filter out non-chat models (audio, tts, embeddings, moderations, dall-e)
		const excludedPrefixes = ['text-embedding', 'tts-', 'whisper', 'dall-e', 'babbage', 'davinci', 'moderation'];
		const filtered = list.filter((m) => {
			const id = String(m.id || '').toLowerCase();
			return !excludedPrefixes.some((p) => id.includes(p));
		});

		return (filtered.length > 0 ? filtered : list).map((item) => ({
			id: item.id,
			name: item.id,
			description: item.owned_by ? `Owned by ${item.owned_by}` : undefined
		}));
	}

	if (provider === 'google') {
		const key = apiKey.trim();
		if (!key) {
			throw new Error('Google Gemini requires an API key to list models. Please enter your key.');
		}
		const url = `${baseUrl}/models?key=${encodeURIComponent(key)}`;
		const res = await fetch(url, { method: 'GET' });
		if (!res.ok) {
			const errText = await res.text().catch(() => '');
			throw new Error(`Google Gemini models query failed (${res.status}): ${errText || res.statusText}`);
		}
		const data = await res.json();
		const list: any[] = Array.isArray(data?.models) ? data.models : [];
		if (list.length === 0) {
			return meta.defaultModels;
		}

		// Only include models that support generateContent
		const chatModels = list.filter((m) => {
			const methods: string[] = Array.isArray(m.supportedGenerationMethods) ? m.supportedGenerationMethods : [];
			return methods.includes('generateContent');
		});

		return (chatModels.length > 0 ? chatModels : list).map((m) => {
			const cleanId = String(m.name || '').replace(/^models\//, '');
			return {
				id: cleanId,
				name: m.displayName || cleanId,
				description: m.description || '',
				contextLength: m.inputTokenLimit
			};
		});
	}

	if (provider === 'anthropic') {
		const key = apiKey.trim();
		if (!key) {
			return meta.defaultModels;
		}
		try {
			const res = await fetch(`${baseUrl}/models`, {
				method: 'GET',
				headers: {
					'x-api-key': key,
					'anthropic-version': '2023-06-01',
					'anthropic-dangerous-direct-browser-access': 'true'
				}
			});
			if (res.ok) {
				const data = await res.json();
				const list: any[] = Array.isArray(data?.data) ? data.data : [];
				if (list.length > 0) {
					return list.map((item) => ({
						id: item.id,
						name: item.display_name || item.id,
						description: item.type ? `Type: ${item.type}` : undefined
					}));
				}
			}
		} catch (e) {
			// CORS or network fallback
		}
		// Return verified curated Anthropic models fallback if endpoint is restricted
		return meta.defaultModels;
	}

	return meta.defaultModels;
}

/**
 * Validate credentials & endpoint connectivity by sending a lightweight test prompt.
 */
export async function testInferenceConnection(
	provider: InferenceProviderId,
	config: ProviderConfig
): Promise<{ success: boolean; latencyMs: number; message: string; model: string }> {
	const startTime = performance.now();
	try {
		const response = await runInference({
			provider,
			model: config.selectedModel,
			systemPrompt: 'You are an automated latency tester. Respond with a single concise sentence acknowledging receipt.',
			prompt: 'Connection test ping from Directing the Machine studio. Respond with "Active: Machine connection established".',
			maxTokens: 60,
			temperature: 0.1
		});

		const latencyMs = Math.round(performance.now() - startTime);
		return {
			success: true,
			latencyMs,
			message: response.text.trim() || 'Connection verified successfully.',
			model: response.model
		};
	} catch (error: any) {
		const latencyMs = Math.round(performance.now() - startTime);
		return {
			success: false,
			latencyMs,
			message: error?.message || 'Connection test failed with unspecified error.',
			model: config.selectedModel
		};
	}
}

/**
 * Primary inference execution service.
 * Automatically resolves the active provider config from `practiceStore` if not specified.
 */
export async function runInference(request: InferenceRequest): Promise<InferenceResponse> {
	const activeProviderId = request.provider || practiceStore.byokSettings.activeProvider;
	const providerConfig = practiceStore.byokSettings.providers[activeProviderId];
	const meta = PROVIDER_METAS[activeProviderId];

	if (!providerConfig) {
		throw new Error(`Inference provider "${activeProviderId}" is not configured.`);
	}

	const apiKey = providerConfig.apiKey.trim();
	if (activeProviderId !== 'custom' && !apiKey) {
		throw new Error(
			`No API key configured for ${meta.name}. Please open Studio Settings and add your ${meta.name} API key.`
		);
	}

	const model = (request.model || providerConfig.selectedModel || meta.defaultModel).trim();
	const baseUrl = (providerConfig.baseUrl?.trim() || meta.defaultBaseUrl).replace(/\/+$/, '');
	const temperature = typeof request.temperature === 'number' ? request.temperature : 0.7;
	const maxTokens = request.maxTokens || 1024;

	// Build messages array
	const messages = request.messages ? [...request.messages] : [];
	if (request.systemPrompt && !messages.some((m) => m.role === 'system')) {
		messages.unshift({ role: 'system', content: request.systemPrompt });
	}
	if (request.prompt) {
		messages.push({ role: 'user', content: request.prompt });
	}

	if (messages.length === 0) {
		throw new Error('Inference request must include either a prompt or messages.');
	}

	const startTime = performance.now();

	// 1. OPENROUTER
	if (activeProviderId === 'openrouter') {
		const res = await fetch(`${baseUrl}/chat/completions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
				'HTTP-Referer': 'https://directing-the-machine.vercel.app',
				'X-Title': 'Directing the Machine Studio'
			},
			body: JSON.stringify({
				model,
				messages,
				temperature,
				max_tokens: maxTokens
			})
		});

		if (!res.ok) {
			const errJson = await res.json().catch(() => null);
			const errMsg = errJson?.error?.message || (await res.text().catch(() => res.statusText));
			throw new Error(`OpenRouter error (${res.status}): ${errMsg}`);
		}

		const data = await res.json();
		const text = data?.choices?.[0]?.message?.content || '';
		const latencyMs = Math.round(performance.now() - startTime);

		return {
			text,
			provider: 'openrouter',
			model: data.model || model,
			latencyMs,
			usage: {
				promptTokens: data?.usage?.prompt_tokens,
				completionTokens: data?.usage?.completion_tokens,
				totalTokens: data?.usage?.total_tokens
			}
		};
	}

	// 2. OPENAI / CUSTOM OPENAI-COMPATIBLE
	if (activeProviderId === 'openai' || activeProviderId === 'custom') {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json'
		};
		if (apiKey) {
			headers['Authorization'] = `Bearer ${apiKey}`;
		}

		const res = await fetch(`${baseUrl}/chat/completions`, {
			method: 'POST',
			headers,
			body: JSON.stringify({
				model,
				messages,
				temperature,
				max_tokens: maxTokens
			})
		});

		if (!res.ok) {
			const errJson = await res.json().catch(() => null);
			const errMsg = errJson?.error?.message || (await res.text().catch(() => res.statusText));
			throw new Error(`${meta.name} error (${res.status}): ${errMsg}`);
		}

		const data = await res.json();
		const text = data?.choices?.[0]?.message?.content || '';
		const latencyMs = Math.round(performance.now() - startTime);

		return {
			text,
			provider: activeProviderId,
			model: data.model || model,
			latencyMs,
			usage: {
				promptTokens: data?.usage?.prompt_tokens,
				completionTokens: data?.usage?.completion_tokens,
				totalTokens: data?.usage?.total_tokens
			}
		};
	}

	// 3. GOOGLE GEMINI
	if (activeProviderId === 'google') {
		// Clean model ID
		const cleanModel = model.replace(/^models\//, '');
		const url = `${baseUrl}/models/${cleanModel}:generateContent?key=${encodeURIComponent(apiKey)}`;

		// Extract system prompt if present
		const systemMessage = messages.find((m) => m.role === 'system');
		const userAssistantMessages = messages.filter((m) => m.role !== 'system');

		const contents = userAssistantMessages.map((m) => ({
			role: m.role === 'assistant' ? 'model' : 'user',
			parts: [{ text: m.content }]
		}));

		const requestBody: any = {
			contents,
			generationConfig: {
				temperature,
				maxOutputTokens: maxTokens
			}
		};

		if (systemMessage) {
			requestBody.systemInstruction = {
				parts: [{ text: systemMessage.content }]
			};
		}

		const res = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(requestBody)
		});

		if (!res.ok) {
			const errJson = await res.json().catch(() => null);
			const errMsg = errJson?.error?.message || (await res.text().catch(() => res.statusText));
			throw new Error(`Google Gemini error (${res.status}): ${errMsg}`);
		}

		const data = await res.json();
		const candidate = data?.candidates?.[0];
		const text = candidate?.content?.parts?.map((p: any) => p.text || '').join('') || '';
		const latencyMs = Math.round(performance.now() - startTime);

		return {
			text,
			provider: 'google',
			model: cleanModel,
			latencyMs,
			usage: {
				promptTokens: data?.usageMetadata?.promptTokenCount,
				completionTokens: data?.usageMetadata?.candidatesTokenCount,
				totalTokens: data?.usageMetadata?.totalTokenCount
			}
		};
	}

	// 4. ANTHROPIC CLAUDE
	if (activeProviderId === 'anthropic') {
		const systemMessage = messages.find((m) => m.role === 'system');
		const userAssistantMessages = messages.filter((m) => m.role !== 'system');

		// Anthropic messages payload
		const anthropicMessages = userAssistantMessages.map((m) => ({
			role: m.role === 'assistant' ? 'assistant' : 'user',
			content: m.content
		}));

		const requestBody: any = {
			model,
			max_tokens: maxTokens,
			temperature,
			messages: anthropicMessages
		};

		if (systemMessage) {
			requestBody.system = systemMessage.content;
		}

		const res = await fetch(`${baseUrl}/messages`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': apiKey,
				'anthropic-version': '2023-06-01',
				'anthropic-dangerous-direct-browser-access': 'true'
			},
			body: JSON.stringify(requestBody)
		});

		if (!res.ok) {
			const errJson = await res.json().catch(() => null);
			const errMsg = errJson?.error?.message || (await res.text().catch(() => res.statusText));
			throw new Error(`Anthropic error (${res.status}): ${errMsg}`);
		}

		const data = await res.json();
		const text = Array.isArray(data?.content)
			? data.content
					.filter((c: any) => c.type === 'text')
					.map((c: any) => c.text)
					.join('\n')
			: '';
		const latencyMs = Math.round(performance.now() - startTime);

		return {
			text,
			provider: 'anthropic',
			model: data.model || model,
			latencyMs,
			usage: {
				promptTokens: data?.usage?.input_tokens,
				completionTokens: data?.usage?.output_tokens,
				totalTokens: (data?.usage?.input_tokens || 0) + (data?.usage?.output_tokens || 0)
			}
		};
	}

	throw new Error(`Unsupported provider: ${activeProviderId}`);
}
