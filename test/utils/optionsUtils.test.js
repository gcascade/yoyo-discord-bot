const { parseCommandArguments, includesOption, getOptionArg } = require('../../utils/optionsUtils');

const options = [{
	name: 'random',
	value: '-random',
	aliases: ['-r', '-rand'],
	description: 'Search for a random wiki page',
	additionalParameter: false,
}, {
	name: 'language',
	value: '-language',
	aliases: ['-l', '-lang'],
	description: 'Set the wiki lang',
	additionalParameter: true,
}];

const optionArguments = [{
	option: {
		name: 'random',
		value: '-random',
		aliases: ['-r', '-rand'],
		description: 'Search for a random wiki page',
		additionalParameter: false,
	},
	args: ['yes', 'no'],
}];

// -------- includesOption ----------
test('includesOption() - finding the \'random\' option', () => {
	expect(includesOption(optionArguments, 'random')).toBe(true);
});


test('includesOption() - not finding the \'unknown\' option', () => {
	expect(includesOption(optionArguments, 'unknown')).toBe(false);
});


test('includesOption() - not finding anything from an empty array', () => {
	expect(includesOption([], 'unknown')).toBe(false);
});

// -------- getOptionArg ----------
test('getOptionArg() - getting the \'random\' option', () => {
	expect(getOptionArg(optionArguments, 'random')).toBe(optionArguments[0]);
});

test('getOptionArg() - getting the \'unknown\' option', () => {
	expect(getOptionArg(optionArguments, 'unknown')).toBeUndefined;
});

test('getOptionArg() - getting an undefined option', () => {
	expect(getOptionArg(optionArguments, undefined)).toBeUndefined;
});

test('getOptionArg() - not getting anything from an empty array', () => {
	expect(getOptionArg([], undefined)).toBeUndefined;
});

// -------- parseCommandArguments ---------
test ('parseCommandArguments() - parsing a single argument', () => {
	const args = ['Spiderman'];
	const expectedResult = [
		{
			args: ['Spiderman'],
		},
	];
	expect(parseCommandArguments(args, options)).toStrictEqual(expectedResult);
});

test ('parseCommandArguments() - parsing multiple arguments', () => {
	const args = ['Spiderman', 'Ironman', 'Hulk'];
	const expectedResult = [
		{
			args: ['Spiderman', 'Ironman', 'Hulk'],
		},
	];
	expect(parseCommandArguments(args, options)).toStrictEqual(expectedResult);
});

test ('parseCommandArguments() - parsing a command without arguments', () => {
	const args = ['-random'];
	const expectedResult = [
		{
			option: {
				name: 'random',
				value: '-random',
				aliases: ['-r', '-rand'],
				description: 'Search for a random wiki page',
				additionalParameter: false,
			},
			args: [],
		},
		{
			args: [],
		},
	];
	expect(parseCommandArguments(args, options)).toStrictEqual(expectedResult);
});

test ('parseCommandArguments() - parsing a command with an argument', () => {
	const args = ['-l', 'en'];
	const expectedResult = [
		{
			option: {
				name: 'language',
				value: '-language',
				aliases: ['-l', '-lang'],
				description: 'Set the wiki lang',
				additionalParameter: true,
			},
			args: ['en'],
		},
		{
			args: [],
		},
	];
	expect(parseCommandArguments(args, options)).toStrictEqual(expectedResult);
});

test ('parseCommandArguments() - parsing a command with multiple arguments', () => {
	const args = ['-l', 'en', 'Marvel', 'DC Comics'];
	const expectedResult = [
		{
			option: {
				name: 'language',
				value: '-language',
				aliases: ['-l', '-lang'],
				description: 'Set the wiki lang',
				additionalParameter: true,
			},
			args: ['en'],
		},
		{
			args: ['Marvel', 'DC Comics'],
		},
	];
	expect(parseCommandArguments(args, options)).toStrictEqual(expectedResult);
});

test ('parseCommandArguments() - parsing multiple commands with an additional argument', () => {
	const args = ['-l', 'en', '-random', 'Final Fantasy'];
	const expectedResult = [
		{
			option: {
				name: 'language',
				value: '-language',
				aliases: ['-l', '-lang'],
				description: 'Set the wiki lang',
				additionalParameter: true,
			},
			args: ['en'],
		},
		{
			option: {
				name: 'random',
				value: '-random',
				aliases: ['-r', '-rand'],
				description: 'Search for a random wiki page',
				additionalParameter: false,
			},
			args: [],
		},
		{
			args: ['Final Fantasy'],
		},
	];
	expect(parseCommandArguments(args, options)).toStrictEqual(expectedResult);
});

test ('parseCommandArguments() - throw an error if the command is unknown', () => {
	const args = ['-unknown'];
	expect(() => parseCommandArguments(args, options)).toThrow('Unknown option: -unknown');
});

test ('parseCommandArguments() - returns an empty array without args', () => {
	expect(parseCommandArguments(undefined, options)).toEqual([]);
});

test ('parseCommandArguments() - returns an empty array with empty args', () => {
	expect(parseCommandArguments([], options)).toEqual([]);
});

test ('parseCommandArguments() - returns an empty array without options', () => {
	const args = ['-unknown'];
	expect(parseCommandArguments(args, undefined)).toEqual([]);
});

test ('parseCommandArguments() - returns an empty array without empty options', () => {
	const args = ['-unknown'];
	expect(parseCommandArguments(args, [])).toEqual([]);
});

