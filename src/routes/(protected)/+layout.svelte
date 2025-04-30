<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="h-screen flex flex-col">
	<main class="flex-1 container mx-auto px-4 py-8">
		<slot />
	</main>
</div> 