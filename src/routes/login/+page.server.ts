import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { login, createUserSession } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		// Validate form fields
		if (
			typeof username !== 'string' ||
			username.length < 3 ||
			typeof password !== 'string' ||
			password.length < 6
		) {
			return fail(400, {
				message: 'Invalid credentials'
			});
		}

		try {
			// Attempt login
			const user = await login(username, password);
			
			if (!user) {
				return fail(400, {
					message: 'Invalid credentials'
				});
			}
			
			// Create session
			await createUserSession(user.id, cookies);
		} catch (error) {
			console.error(error);
			return fail(400, {
				message: 'An error occurred during login'
			});
		}

		throw redirect(302, '/');
	}
}; 