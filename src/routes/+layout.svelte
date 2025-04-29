<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import { ModeWatcher } from "mode-watcher";
  
  interface LayoutProps {
    children: any;
  }
  
  let { children } = $props<LayoutProps>();
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
      <div>
        <a href="/" class="text-lg font-bold hover:text-gray-600 dark:hover:text-gray-300">Home</a>
        <a href="/chatbot" class="ml-4 text-lg font-bold hover:text-gray-600 dark:hover:text-gray-300">Chatbot</a>
        <a href="/button" class="ml-4 text-lg font-bold hover:text-gray-600 dark:hover:text-gray-300">Button</a>
        <a href="/users" class="ml-4 text-lg font-bold hover:text-gray-600 dark:hover:text-gray-300">Users</a>
      <ThemeToggle />
      </div>
      
      
    </nav>
  </header>

  <main class="container mx-auto p-4">
    {@render children()}
  </main>
</div>