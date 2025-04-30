import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { env } from 'process';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		fs: {
			allow: ['.']
		}
	},
	define: {
      'process.env.OPENAI_API_KEY': JSON.stringify(env.OPENAI_API_KEY)
    }
});
