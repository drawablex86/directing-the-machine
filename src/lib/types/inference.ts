export type InferenceProviderId = 'openrouter' | 'openai' | 'google' | 'anthropic' | 'custom';

export interface ModelOption {
	id: string;
	name: string;
	description?: string;
	contextLength?: number;
	isFree?: boolean;
	pricing?: {
		prompt?: string;
		completion?: string;
	};
}

export interface ProviderConfig {
	apiKey: string;
	baseUrl?: string;
	selectedModel: string;
	availableModels: ModelOption[];
	lastFetchedAt?: string;
}

export interface ByokSettings {
	activeProvider: InferenceProviderId;
	providers: Record<InferenceProviderId, ProviderConfig>;
}

export interface InferenceMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

export interface InferenceRequest {
	provider?: InferenceProviderId;
	model?: string;
	messages?: InferenceMessage[];
	prompt?: string;
	systemPrompt?: string;
	temperature?: number;
	maxTokens?: number;
}

export interface InferenceResponse {
	text: string;
	thought?: string;
	isTruncated?: boolean;
	provider: InferenceProviderId;
	model: string;
	latencyMs: number;
	usage?: {
		promptTokens?: number;
		completionTokens?: number;
		totalTokens?: number;
	};
}

export interface ProviderMeta {
	id: InferenceProviderId;
	name: string;
	badge?: string;
	defaultBaseUrl: string;
	defaultModel: string;
	keyPlaceholder: string;
	keyHelpUrl: string;
	keyHelpText: string;
	description: string;
	defaultModels: ModelOption[];
}
