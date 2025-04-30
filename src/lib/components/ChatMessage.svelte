<script lang="ts">
  export let message: string;
  export let isUser: boolean = false;
  export let timestamp: number | undefined = undefined;
  export let messageId: string | undefined = undefined;
  
  // Format timestamp to show relative time
  $: formattedTime = timestamp ? formatRelativeTime(timestamp) : '';
  
  // Helper function to format relative time
  function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    
    // Convert to seconds
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) {
      return 'just now';
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const date = new Date(timestamp);
      return date.toLocaleString();
    }
  }

  // Feedback handling
  let feedbackGiven = false;
  let feedbackType: 'like' | 'dislike' | null = null;
  
  function handleFeedback(type: 'like' | 'dislike') {
    if (feedbackGiven || isUser || !messageId) return;
    
    // Dispatch a custom event to document for parent to listen to
    const event = new CustomEvent('feedback', {
      detail: { messageId, type }
    });
    document.dispatchEvent(event);
    
    feedbackGiven = true;
    feedbackType = type;
  }
</script>

<div class="mb-4 scroll-y-auto {isUser ? 'text-right' : ''}">
  <div class="flex flex-col {isUser ? 'items-end' : 'items-start'}">
    <div class="{isUser ? 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white' : 'bg-blue-500 dark:bg-blue-600 text-white'} p-3 rounded-lg inline-block max-w-xs sm:max-w-md">
      <div class="whitespace-pre-wrap break-words">
        {message}
      </div>
      
      {#if !isUser && messageId}
        <div class="mt-2 pt-2 border-t border-blue-400 dark:border-blue-500 flex justify-end space-x-2">
          <button 
            on:click={() => handleFeedback('like')}
            class="text-white hover:text-green-200 {feedbackGiven && feedbackType !== 'like' ? 'opacity-50' : ''}"
            disabled={feedbackGiven}
            title="Helpful"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor" fill={feedbackType === 'like' ? 'currentColor' : 'none'}>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
          </button>
          <button 
            on:click={() => handleFeedback('dislike')}
            class="text-white hover:text-red-200 {feedbackGiven && feedbackType !== 'dislike' ? 'opacity-50' : ''}"
            disabled={feedbackGiven}
            title="Not helpful"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" stroke="currentColor" fill={feedbackType === 'dislike' ? 'currentColor' : 'none'}>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
            </svg>
          </button>
        </div>
      {/if}
    </div>
    {#if timestamp}
      <span class="text-xs text-gray-500 mt-1">
        {formattedTime}
      </span>
    {/if}
  </div>
</div>