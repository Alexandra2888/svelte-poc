<script lang="ts">
  export let message: string;
  export let isUser: boolean = false;
</script>

<div class="mb-2 {isUser ? 'text-right' : ''}">
  <div class="{isUser ? 'bg-gray-300 text-gray-800' : 'bg-blue-500 text-white'} p-2 rounded-lg inline-block max-w-xs sm:max-w-md">
    {message}
  </div>
</div>