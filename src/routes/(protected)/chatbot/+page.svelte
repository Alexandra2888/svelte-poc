<style>
	.chatbot-container {
		height: 80vh;
		max-height: 700px;
		display: flex;
		flex-direction: column;
	}
	
	.chatbot-messages {
		flex: 1;
		overflow-y: auto;
		padding: 1rem;
	}
	
	.chatbot-input {
		padding: 1rem;
		border-top: 1px solid #e5e7eb;
	}
	
	:global(.dark) .chatbot-input {
		border-color: #4b5563;
	}
</style>

<script lang="ts">
	import ChatMessage from '$lib/components/ChatMessage.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.js';
	import { onMount, afterUpdate, onDestroy } from 'svelte';
	import { chatStorage, type ChatMessage as ChatMessageType } from '$lib/utils/utils';

	let messages: ChatMessageType[] = [];
	let newMessage = '';
	let loading = false;
	let chatContainer: HTMLElement;
	let autoScroll = true;
	
	// Maximum number of previous messages to include as context
	const MAX_CONTEXT_MESSAGES = 10;
	
	// Load messages from localStorage on mount
	onMount(() => {
		const storedMessages = chatStorage.getMessages();
		
		if (storedMessages.length > 0) {
			messages = storedMessages;
		} else {
			// Add initial bot message if no stored messages
			messages = [
				{ 
					text: 'Hello! How can I assist you today?', 
					isUser: false, 
					timestamp: Date.now(),
					messageId: generateMessageId()
				}
			];
			chatStorage.saveMessages(messages);
		}
		
		// Add scroll event listener to detect when user scrolls up
		if (chatContainer) {
			chatContainer.addEventListener('scroll', handleScroll);
		}
		
		// Add event listener for feedback events
		document.addEventListener('feedback', handleMessageFeedback);
		
		// Cleanup on component destroy
		return () => {
			if (chatContainer) {
				chatContainer.removeEventListener('scroll', handleScroll);
			}
		};
	});

	// Clean up event listener on destroy
	onDestroy(() => {
		document.removeEventListener('feedback', handleMessageFeedback);
	});
	
	// Generate a unique message ID
	function generateMessageId(): string {
		return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
	}
	
	// Handle feedback from chat messages
	function handleMessageFeedback(event: CustomEvent) {
		const { messageId, type } = event.detail;
		console.log(`Feedback received: ${type} for message ${messageId}`);
		
		// In a real app, you would send this to your backend API
		// For example:
		// fetch('/api/feedback', {
		//   method: 'POST',
		//   headers: { 'Content-Type': 'application/json' },
		//   body: JSON.stringify({ messageId, feedbackType: type })
		// });
	}
	
	// After any update, handle scrolling
	afterUpdate(() => {
		if (autoScroll && chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	});
	
	function handleScroll() {
		if (!chatContainer) return;
		
		// Check if user has scrolled up away from bottom
		const isAtBottom = chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 100;
		autoScroll = isAtBottom;
	}
	
	// Save messages to localStorage whenever they change
	$: if (messages.length > 0) {
		chatStorage.saveMessages(messages);
	}
	
	// Scroll to bottom button handler
	function scrollToBottom() {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
			autoScroll = true;
		}
	}
	
	// Convert our chat messages to the format expected by the API
	function formatMessagesForAPI(messages: ChatMessageType[]) {
		// Get only the most recent messages for context
		const recentMessages = messages.slice(-MAX_CONTEXT_MESSAGES);
		
		return recentMessages.map(msg => ({
			role: msg.isUser ? 'user' : 'assistant',
			content: msg.text
		}));
	}
	
	async function sendMessage() {
		if (!newMessage.trim()) return;
		
		// Add user message to chat
		const userMessage = newMessage.trim();
		messages = [...messages, { 
			text: userMessage, 
			isUser: true, 
			timestamp: Date.now(),
			messageId: generateMessageId()
		}];
		newMessage = '';
		loading = true;
		autoScroll = true;
		
		try {
			// Get context from previous messages
			const apiMessages = formatMessagesForAPI([...messages]);
			
			// Send message to API with context
			const response = await fetch('/api/chatbot', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ messages: apiMessages })
			});
			
			if (!response.ok) {
				throw new Error(`API returned ${response.status}`);
			}
			
			const data = await response.json();
			
			// Add bot response to chat
			if (data.content) {
				messages = [...messages, { 
					text: data.content, 
					isUser: false, 
					timestamp: Date.now(),
					messageId: generateMessageId()
				}];
			} else if (data.error) {
				messages = [...messages, { 
					text: `Error: ${data.error}`, 
					isUser: false, 
					timestamp: Date.now(),
					messageId: generateMessageId()
				}];
			}
		} catch (error) {
			console.error('Error sending message:', error);
			messages = [...messages, { 
				text: 'Sorry, there was an error processing your request.', 
				isUser: false, 
				timestamp: Date.now(),
				messageId: generateMessageId()
			}];
		} finally {
			loading = false;
		}
	}
	
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	}

	function clearHistory() {
		messages = [{ 
			text: 'Chat history cleared. How can I help you?', 
			isUser: false, 
			timestamp: Date.now(),
			messageId: generateMessageId()
		}];
		chatStorage.saveMessages(messages);
		autoScroll = true;
	}
	
	function exportHistory() {
		chatStorage.exportMessages();
	}
</script>

<div class="w-full max-w-3xl mx-auto my-4 sm:my-8 shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 chatbot-container">
	<div class="bg-blue-600 dark:bg-blue-800 text-white p-4">
		<div class="flex justify-between items-center">
			<h2 class="text-xl font-semibold">Chatbot</h2>
			
			<div class="flex space-x-2">
				<Button 
					variant="outline" 
					size="sm" 
					class="text-white border-white hover:bg-blue-700 dark:hover:bg-blue-900" 
					on:click={clearHistory}
				>
					Clear
				</Button>
				
				<Button 
					variant="outline" 
					size="sm" 
					class="text-white border-white hover:bg-blue-700 dark:hover:bg-blue-900" 
					on:click={exportHistory}
				>
					Export
				</Button>
			</div>
		</div>
	</div>
	
	<div 
		bind:this={chatContainer}
		class="chatbot-messages"
	>
		{#each messages as message}
			<ChatMessage 
				message={message.text} 
				isUser={message.isUser} 
				timestamp={message.timestamp}
				messageId={message.messageId}
			/>
		{/each}
		
		{#if loading}
			<div class="flex items-center justify-center mt-2">
				<div class="animate-pulse flex space-x-1">
					<div class="h-2 w-2 bg-blue-500 rounded-full"></div>
					<div class="h-2 w-2 bg-blue-500 rounded-full"></div>
					<div class="h-2 w-2 bg-blue-500 rounded-full"></div>
				</div>
			</div>
		{/if}
	</div>
	
	{#if !autoScroll && messages.length > 1}
		<div class="flex justify-center py-2 border-t border-gray-200 dark:border-gray-700">
			<Button 
				variant="outline" 
				size="sm" 
				class="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400" 
				on:click={scrollToBottom}
			>
				<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
				</svg>
				Scroll to Bottom
			</Button>
		</div>
	{/if}
	
	<div class="chatbot-input flex items-center border-t border-gray-200 dark:border-gray-600">
		<Input 
			type="text" 
			bind:value={newMessage}
			on:keydown={handleKeydown}
			placeholder="Type a message..." 
			class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
			disabled={loading}
		/>
		<Button 
			variant="info"
			on:click={sendMessage}
			disabled={loading || !newMessage.trim()} 
			class="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			Send
		</Button>
	</div>
</div>