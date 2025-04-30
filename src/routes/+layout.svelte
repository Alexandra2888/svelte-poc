<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import { ModeWatcher, mode } from "mode-watcher";
  import { Button } from '$lib/components/ui/button';
  
  // Use a single $props
  let { data, children } = $props();
  let mounted = $state(false);
  
  // Track current mode
  let currentMode = $state('system');
  
  // Subscribe to mode changes
  mode.subscribe(value => {
    currentMode = value || 'system';
    
    // Manually add/remove dark class for debugging
    if (mounted) {
      if (value === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });
  
  onMount(() => {
    mounted = true;
  });
</script>

<!-- Mode Watcher with theme colors and explicit defaultMode -->
<ModeWatcher defaultMode="dark" themeColors={{ dark: "#020817", light: "#ffffff" }} />

<div class="min-h-screen">
  <header class=" p-4 dow-md">
    <nav class="container mx-auto flex justify-between items-center px-4">
      <div class="flex items-center space-x-4">
        <a href="/" class="text-lg font-bold hover:text-gray-600 dark:hover:text-gray-300">Home</a>
        <a href="/chatbot" class="text-lg font-bold hover:text-gray-600 dark:hover:text-gray-300">Chatbot</a>
        <a href="/button" class="text-lg font-bold hover:text-gray-600 dark:hover:text-gray-300">Button</a>
        <a href="/users" class="text-lg font-bold hover:text-gray-600 dark:hover:text-gray-300">Users</a>
      </div>
      
      <div class="flex items-center space-x-4">
        <span class="text-xs  px-2 py-1 rounded">Mode: {currentMode}</span>
        <ThemeToggle />
        
        {#if data.user}
          <span class="text-sm">Hello, {data.user.username}</span>
          <form action="/logout" method="POST">
            <Button variant="outline" size="sm" type="submit">Logout</Button>
          </form>
        {:else}
          <a href="/login">
            <Button variant="outline" size="sm">Login</Button>
          </a>
          <a href="/register">
            <Button variant="default" size="sm">Register</Button>
          </a>
        {/if}
      </div>
    </nav>
  </header>

  <main class="container mx-auto p-4">
    {@render children()}
  </main>
</div>