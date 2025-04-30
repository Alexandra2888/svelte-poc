<script>
import { Button } from "$lib/components/ui/button";


  let count = 0;

  function increment() {
    count += 1;
  }

  function decrement() {
    count -= 1;
  }

  function reset() {
    count = 0;
  }
</script>

<div class="flex flex-col items-center justify-center h-screen">
  <h1 class="text-2xl mb-4">Counter: {count}</h1>
  <div class="flex space-x-4">
    <Button on:click={decrement} class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">Decrement</Button>
    <Button on:click={increment} class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">Increment</Button>
    <Button on:click={reset} class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">Reset</Button>

</div>
</div>