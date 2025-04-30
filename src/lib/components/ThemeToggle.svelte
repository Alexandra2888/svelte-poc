<script lang="ts">
 import Sun from "lucide-svelte/icons/sun";
 import Moon from "lucide-svelte/icons/moon";
 
 import { toggleMode, mode } from "mode-watcher";
 import { Button } from "$lib/components/ui/button/index.js";
 
 // Track current mode for display
 let currentMode = 'system';
 
 // Subscribe to mode changes
 mode.subscribe(value => {
   currentMode = value || 'system';
 });
</script>

<!-- Simple button to toggle theme directly -->
<Button  
  size="icon" 
  class="relative" 
  on:click={toggleMode}
>
 <Sun
  class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0"
 />
 <Moon
  class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100"
 />
 <span class="sr-only">Toggle theme: {currentMode}</span>
</Button>