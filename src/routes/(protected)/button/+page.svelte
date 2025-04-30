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
    <Button on:click={decrement} variant="success" class=" px-4 py-2 rounded-md  focus:outline-none focus:ring-2 ">Decrement</Button>
    <Button on:click={increment} variant="info" class="px-4 py-2 rounded-md  focus:outline-none focus:ring-2 ">Increment</Button>
    <Button on:click={reset} variant="destructive" class="  px-4 py-2 rounded-md  focus:outline-none focus:ring-2 ">Reset</Button>

</div>
</div>