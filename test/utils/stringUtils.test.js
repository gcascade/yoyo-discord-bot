const { getUriQueryArgs } = require('../../utils/stringUtils');

test('getUriQueryArgs() - parsing an empty uri', () => {
	expect(getUriQueryArgs(undefined)).toBeUndefined;
});

test('getUriQueryArgs() - parsing a simple uri', () => {
	expect(getUriQueryArgs('wwww.yoyodiscordbot.com')).toBeUndefined;
});

test('getUriQueryArgs() - parsing an uri with 1 query argument', () => {
	const expected = {
		animal: 'cat',
	};
	expect(getUriQueryArgs('www.yoyodiscordbot.com?animal=cat')).toStrictEqual(expected);
});

test('getUriQueryArgs() - parsing an uri with 2 query arguments', () => {
	const expected = {
		animal: 'cat',
		color: 'gray',
	};
	expect(getUriQueryArgs('www.yoyodiscordbot.com?animal=cat&color=gray')).toStrictEqual(expected);
});
