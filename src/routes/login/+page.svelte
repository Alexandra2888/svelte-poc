<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import type { PageData } from "./$types";

	export let data: PageData;

	// If user is already logged in, redirect to home
	$: if (data.user) {
		goto("/");
	}
</script>

<div class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<h1 class="text-3xl font-bold tracking-tight">Login</h1>
			<p class="mt-2 text-sm text-gray-600">
				Don't have an account?
				<a href="/register" class="font-medium text-primary hover:underline">Register</a>
			</p>
		</div>

		<form method="POST" action="?/login" use:enhance class="space-y-6 mt-8">
			<div>
				<label for="username" class="block text-sm font-medium text-gray-700">Username</label>
				<input
					id="username"
					name="username"
					type="text"
					required
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
				/>
			</div>

			<Button type="submit" class="w-full">Sign in</Button>
		</form>
	</div>
</div> 