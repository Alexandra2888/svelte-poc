<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input/index.js';

  // Define a User type
  type User = {
    id: number;
    name: string;
    email: string;
  };

  // Type the users store
  let users = writable<User[]>([]);
  let newUser: Omit<User, 'id'> = { name: '', email: '' };
  let apiUrl = 'https://jsonplaceholder.typicode.com/users';

  onMount(async () => {
    const response = await fetch(apiUrl);
    users.set(await response.json());
  });

  async function createUser() {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });
    const user: User = await response.json();
    users.update(current => [...current, user]);
    newUser = { name: '', email: '' };
  }

  async function deleteUser(id: number) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    users.update(current => current.filter(user => user.id !== id));
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl mb-4">User Management</h1>
  <div class="mb-4">
    <Input bind:value={newUser.name} placeholder="Name" class="mr-2" />
    <Input bind:value={newUser.email} placeholder="Email" class="mr-2" />
    <Button on:click={createUser} class="bg-green-500 text-white">Add User</Button>
  </div>
  <ul>
    {#each $users as user}
      <li class="flex justify-between items-center mb-2 p-2 border-b">
        <span>{user.name} ({user.email})</span>
        <Button on:click={() => deleteUser(user.id)} class="bg-red-500 text-white">Delete</Button>
      </li>
    {/each}
  </ul>
</div>