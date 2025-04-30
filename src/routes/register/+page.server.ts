import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { register, createUserSession } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	register: async ({ request, cookies }) => {
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
				message: 'Invalid credentials. Username must be at least 3 characters and password at least 6 characters.'
			});
		}

		try {
			// Create user
			const user = await register(username, password);
			
			if (!user) {
				return fail(400, {
					message: 'Username already taken'
				});
			}
			
			// Create session
			await createUserSession(user.id, cookies);
		} catch (error) {
			console.error(error);
			return fail(400, {
				message: 'Username already taken'
			});
		}

		throw redirect(302, '/');
	}
}; 