const openai = require('../../../ai/openai/openai');
const { OpenAIApi } = require('openai');

jest.mock('openai', () => {
    return {
        OpenAIApi: jest.fn().mockImplementation(() => {
            return {
                createCompletion: jest.fn().mockImplementation(() => {
                    return {
                        data: {
                            choices: [{
                                text: 'Hello World!'
                            }]
                        }
                    }
                }),
            }
        }),
        Configuration: jest.fn().mockImplementation(() => {
            return {
                apiKey: '12345',
            }
        }),
    }
});

const prompt = 'Ping!';

test('ask() - OpenAI', async () => {
	process.env.AI = 'OPENAI';
    process.env.OPENAI_API_KEY = '123';
    console.log(OpenAIApi)
	const result = await openai.ask(prompt);
	expect(result).toBe('Hello World!');
});

test('ask() - OpenAI - no API Key', async () => {
	process.env.AI = 'OPENAI';
    process.env.OPENAI_API_KEY = '';
    const result = await openai.ask(prompt);
    expect(result).toBeUndefined();
});