const { checkForInvalidArguments, askAI } = require('../../../utils/commands/common');
const ai = require('../../../ai/common');

const client = {
	user: {
		id: '123',
	},
	users: {
		cache: {
			get: () => { return { id: '123' }; }
		}
	}
}

const command = {
	name: 'wiki',
	description: 'Search info from a wiki',
	options: [{
		name: 'random',
		value: '-r',
		aliases: ['-random', '-rand'],
		description: 'Search for a random wiki page',
		additionalParameter: false,
	}],
	cooldown: 10,
}

const exclusiveCommand = {	
	name: 'tag',
	description: 'Get, create, update or delete a tag',
	options: [{
		name: 'add',
		value: '-add',
		aliases: ['-a', '-create'],
		description: 'Create a tag',
		additionalParameter: false,
	}, {
		name: 'update',
		value: '-update',
		aliases: ['-u'],
		description: 'Update the tag',
		additionalParameter: false,
	}, {
		name: 'delete',
		value: '-delete',
		aliases: ['-d', '-del', '-r', '-remove'],
		description: 'Delete the tag',
		additionalParameter: false,
	}],
	cooldown: 10,
	hidden: true,
	exclusiveCommands: [ 'add', 'update', 'delete'],
	limit: 10,
}

const message = {
    content: '!test',
	reply: async (x) => { return x; },
}

const args = ['-random']

const exclusiveArgs = ['-add', '-update', '-delete']

jest.mock('../../../ai/common')
ai.ask.mockResolvedValue('Hello World!');

// ========== checkForInvalidArguments ==========

test('checkForInvalidArguments() - no command', async () => {
	const result = await checkForInvalidArguments(null, message, args);
	expect(result).toBe(false);
});


test('checkForInvalidArguments() - no message', async () => {
	const result = await checkForInvalidArguments(command, null, args);
	expect(result).toBe(false);
});

test('checkForInvalidArguments() - no args', async () => {
	const result = await checkForInvalidArguments(command, message, null);
	expect(result).toBe(true);
});

test('checkForInvalidArguments() - no exclusive args', async () => {
	const result = await checkForInvalidArguments(command, message, args);
	expect(result).toBe(true);
});

test('checkForInvalidArguments() - more than one exclusive command', async () => {
	const result = await checkForInvalidArguments(exclusiveCommand, message, exclusiveArgs);
	expect(result).toBe(false);
});

// ========== askAI ==========
test('askAI() - no ai', async () => {
	process.env.AI = 'NONE';
	const result = await askAI(message);
	expect(result).toBeUndefined();
});


test('askAI() - openai', async () => {
	process.env.AI = 'OPENAI';
	const result = await askAI(client, message);
	expect(result).toBe('Hello World!');
});

test('askAI() - openai - no answer', async () => {
	process.env.AI = 'OPENAI';
	ai.ask.mockResolvedValue(null);
	const result = await askAI(client, message);
	expect(result).toBeUndefined();
});