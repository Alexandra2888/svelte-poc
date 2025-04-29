<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input/index.js';
</script>



<main class="chatbot-container max-w-lg mx-auto mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
  <div class="chatbot-header bg-blue-600 text-white p-4 text-center">
    <h2 class="text-xl font-semibold">Chatbot</h2>
  </div>
  <div class="chatbot-messages p-4 h-64 overflow-y-auto bg-gray-100">
    <!-- Example message bubbles -->
    <div class="mb-2">
      <div class="bg-blue-500 text-white p-2 rounded-lg inline-block">Hello! How can I assist you today?</div>
    </div>
    <div class="mb-2 text-right">
      <div class="bg-gray-300 text-gray-800 p-2 rounded-lg inline-block">How is weather today?</div>
    </div>
  </div>
  <div class="chatbot-input flex items-center p-4 border-t border-gray-200">
    <Input type="text" placeholder="Type a message..." class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
    <Button class="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Send</Button>
  </div>
</main>
