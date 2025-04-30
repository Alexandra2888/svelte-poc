<script lang="ts">
  export let message: string;
  export let isUser: boolean = false;
  export let timestamp: number | undefined = undefined;
  
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
</script>

<div class="mb-4 scroll-y-auto {isUser ? 'text-right' : ''}">
  <div class="flex flex-col {isUser ? 'items-end' : 'items-start'}">
    <div class="{isUser ? 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white' : 'bg-blue-500 dark:bg-blue-600 text-white'} p-3 rounded-lg inline-block max-w-xs sm:max-w-md">
      <div class="whitespace-pre-wrap break-words">
        {message}
      </div>
    </div>
    {#if timestamp}
      <span class="text-xs text-gray-500 mt-1">
        {formattedTime}
      </span>
    {/if}
  </div>
</div>