<!-- @component Button component with variants -->
<script lang="ts">
	import { cn } from "$lib/utils";
	import { buttonVariants, type ButtonVariants } from ".";

	type $$Props = ButtonVariants & {
		type?: "button" | "submit" | "reset";
		class?: string;
		disabled?: boolean;
	};

	let className: string = "";
	export { className as class };
	export let variant: $$Props["variant"] = "default";
	export let size: $$Props["size"] = "default";
	export let type: $$Props["type"] = "button";
	export let disabled: $$Props["disabled"] = false;
</script>

<button
	type={type}
	class={cn(buttonVariants({ variant, size }), className)}
	{disabled}
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</button>
