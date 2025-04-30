import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OPENAI_API_KEY } from '$env/static/private';
import OpenAI from 'openai';

// Create OpenAI instance
const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

// Instruction message
const instructionMessage = {
	role: 'system',
	content: "You are a helpful assistant. Provide concise and accurate responses."
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { messages } = body;

		if (!OPENAI_API_KEY) {
			return json({ error: 'OpenAI API key not configured' }, { status: 500 });
		}

		if (!messages) {
			return json({ error: 'Messages are required' }, { status: 400 });
		}

		const response = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [instructionMessage, ...messages]
		});

		return json(response.choices[0].message);
	} catch (error) {
		console.error("[CHATBOT_ERROR]", error);
		return json({ error: 'Failed to process request' }, { status: 500 });
	}
}; 