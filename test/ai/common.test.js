const common = require('../../ai/common');
const openai = require('../../ai/openai/openai');

jest.mock('../../ai/openai/openai')
openai.ask.mockResolvedValue('Hello World!');

const prompt = 'Hello World!';

test('ask() - no prompt', async () => {
    const result = await common.ask(null);
    expect(result).toBeUndefined();
});

test('ask() - no ai', async () => {
	process.env.AI = 'NONE';
	const result = await common.ask(prompt);
	expect(result).toBeUndefined();
});

test('ask() - OpenAI', async () => {
	process.env.AI = 'OPENAI';
	const result = await common.ask(prompt);
	expect(result).toBe('Hello World!');
});