<script lang="ts">
	import ChatMessage from '$lib/components/ChatMessage.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.js';
	import { onMount } from 'svelte';

	type Message = {
		text: string;
		isUser: boolean;
	};
	
	let messages: Message[] = [];
	let newMessage = '';
	let loading = false;
	let chatContainer: HTMLElement;
	
	// Add initial bot message
	onMount(() => {
		messages = [
			{ text: 'Hello! How can I assist you today?', isUser: false }
		];
	});
	
	// Scroll to bottom of chat when messages change
	$: if (messages && chatContainer) {
		setTimeout(() => {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}, 0);
	}
	
	async function sendMessage() {
		if (!newMessage.trim()) return;
		
		// Add user message to chat
		const userMessage = newMessage.trim();
		messages = [...messages, { text: userMessage, isUser: true }];
		newMessage = '';
		loading = true;
		
		try {
			// Send message to API with the expected format
			const response = await fetch('/api/chatbot', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ 
					messages: [{ role: 'user', content: userMessage }] 
				})
			});
			
			if (!response.ok) {
				throw new Error(`API returned ${response.status}`);
			}
			
			const data = await response.json();
			
			// Add bot response to chat
			if (data.content) {
				messages = [...messages, { text: data.content, isUser: false }];
			} else if (data.error) {
				messages = [...messages, { text: `Error: ${data.error}`, isUser: false }];
			}
		} catch (error) {
			console.error('Error sending message:', error);
			messages = [...messages, { text: 'Sorry, there was an error processing your request.', isUser: false }];
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
</script>

<main class="chatbot-container max-w-lg mx-auto mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
	<div class="chatbot-header bg-blue-600 dark:bg-blue-800 text-white p-4 text-center">
		<h2 class="text-xl font-semibold">Chatbot</h2>
	</div>
	
	<div 
		bind:this={chatContainer}
		class="chatbot-messages p-4 h-64 overflow-y-auto bg-gray-100 dark:bg-gray-700"
	>
		{#each messages as message}
			<ChatMessage message={message.text} isUser={message.isUser} />
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
	
	<div class="chatbot-input flex items-center p-4 border-t border-gray-200 dark:border-gray-600">
		<Input 
			type="text" 
			bind:value={newMessage}
			on:keydown={handleKeydown}
			placeholder="Type a message..." 
			class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
			disabled={loading}
		/>
		<Button 
			on:click={sendMessage}
			disabled={loading || !newMessage.trim()} 
			class="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			Send
		</Button>
	</div>
</main>