import { getUserFromSession } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Get the user from session
	const user = await getUserFromSession(event.cookies);
	
	// Set user in locals for access in routes
	event.locals.user = user;
	
	return await resolve(event);
}; 