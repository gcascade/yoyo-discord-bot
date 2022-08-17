const { oneLineCommaListsOr } = require('common-tags');
const { parseCommandArguments } = require('../optionsUtils');
const ai = require('../../ai/common');


exports.checkForInvalidArguments = async function(command, message, args) {
	if (!command || !message) {
		return false;
	}

	let isMessageValid = true;
	const argOptions = parseCommandArguments(args, command.options);

	const moreThanOneExclusiveCommandUsed = argOptions.filter(argOpt => command.exclusiveCommands?.includes(argOpt?.option?.name)).length > 1;

	if (moreThanOneExclusiveCommandUsed) {
		await message.reply(oneLineCommaListsOr`Use **at most** one of the following commands: ${command?.exclusiveCommands}`);
		isMessageValid = false;
	}

	return isMessageValid;
};

const aiList = ['OPENAI']

exports.askAI = async function(client, message) {
	if (aiList.includes(process.env.AI)) {
		const content = message.content.replace(`<@!${client.user.id}>`, client.user.username);
		const answer = await ai.ask(content);
		if (answer) {
			return message.reply(answer);
		}
	}
};