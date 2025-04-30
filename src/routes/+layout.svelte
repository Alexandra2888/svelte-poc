<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import { ModeWatcher } from "mode-watcher";
  import { Button } from '$lib/components/ui/button';
  
  // Use a single $props
  let { data, children } = $props();
  let mounted = $state(false);
  
  onMount(() => {
    mounted = true;
  });
</script>

<!-- ModeWatcher should be at the root level, not inside the header -->
<ModeWatcher />

<div class="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
  <header class="bg-gray-100 dark:bg-gray-800 p-4 text-black dark:text-white shadow-md">
    <nav class="container mx-auto flex justify-between items-center px-4">
      <div class="flex items-center space-x-4">
        <a href="/" class="text-lg font-bold hover:text-gray-600 dark:hover:text-gray-300">Home</a>
        <a href="/chatbot" class="text-lg font-bold hover:text-gray-600 dark:hover:text-gray-300">Chatbot</a>
        <a href="/button" class="text-lg font-bold hover:text-gray-600 dark:hover:text-gray-300">Button</a>
        <a href="/users" class="text-lg font-bold hover:text-gray-600 dark:hover:text-gray-300">Users</a>
      </div>
      
      <div class="flex items-center space-x-4">
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
            <Button size="sm">Register</Button>
          </a>
        {/if}
      </div>
    </nav>
  </header>

  <main class="container mx-auto p-4">
    {@render children()}
  </main>
</div>