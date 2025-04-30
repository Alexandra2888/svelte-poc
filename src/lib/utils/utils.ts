import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === "none" ? "" : style.transform;

	const scaleConversion = (
		valueA: number,
		scaleA: [number, number],
		scaleB: [number, number]
	) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (
		style: Record<string, number | string | undefined>
	): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, "");
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

// Chat message types
export type ChatMessage = {
	text: string;
	isUser: boolean;
	timestamp?: number;
	messageId?: string;
	feedback?: 'like' | 'dislike' | null;
};

// Chat storage utility
export const chatStorage = {
	storageKey: 'chat_messages',
	
	// Save messages to localStorage
	saveMessages: (messages: ChatMessage[]): void => {
		if (typeof window !== 'undefined') {
			localStorage.setItem(
				chatStorage.storageKey, 
				JSON.stringify(messages)
			);
		}
	},
	
	// Get messages from localStorage
	getMessages: (): ChatMessage[] => {
		if (typeof window !== 'undefined') {
			const stored = localStorage.getItem(chatStorage.storageKey);
			if (stored) {
				try {
					return JSON.parse(stored);
				} catch (e) {
					console.error('Failed to parse stored messages:', e);
				}
			}
		}
		return [];
	},
	
	// Clear all stored messages
	clearMessages: (): void => {
		if (typeof window !== 'undefined') {
			localStorage.removeItem(chatStorage.storageKey);
		}
	},
	
	// Export messages as a downloadable JSON file
	exportMessages: (): void => {
		const messages = chatStorage.getMessages();
		if (messages.length === 0) return;
		
		const fileName = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
		const jsonStr = JSON.stringify(messages, null, 2);
		const blob = new Blob([jsonStr], { type: 'application/json' });
		
		// Create download link
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = fileName;
		
		// Trigger download
		document.body.appendChild(link);
		link.click();
		
		// Cleanup
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	},
	
	// Import messages from a JSON file
	importMessages: (jsonData: string): boolean => {
		try {
			const messages = JSON.parse(jsonData) as ChatMessage[];
			if (!Array.isArray(messages)) return false;
			
			// Validate message format
			const isValid = messages.every(msg => 
				typeof msg === 'object' && 
				typeof msg.text === 'string' && 
				typeof msg.isUser === 'boolean'
			);
			
			if (isValid) {
				chatStorage.saveMessages(messages);
				return true;
			}
			return false;
		} catch (e) {
			console.error('Failed to import messages:', e);
			return false;
		}
	}
};