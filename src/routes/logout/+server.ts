import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logout } from '$lib/server/auth';

export const POST: RequestHandler = async ({ locals, cookies }) => {
	if (!locals.user) {
		throw redirect(302, '/login');
	}
	
	await logout(cookies);
	throw redirect(302, '/login');
}; 