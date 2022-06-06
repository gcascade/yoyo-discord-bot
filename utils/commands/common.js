const { oneLineCommaListsOr } = require('common-tags');
const { parseCommandArguments } = require('../optionsUtils');


exports.checkForInvalidArguments = async function(command, message, args) {
	let isMessageValid = true;
	const argOptions = parseCommandArguments(args, command.options);

	const moreThanOneExclusiveCommandUsed = argOptions.filter(argOpt => command.exclusiveCommands?.includes(argOpt?.option?.name)).length > 1;

	if (moreThanOneExclusiveCommandUsed) {
		await message.reply(oneLineCommaListsOr`Use **at most** one of the following commands: ${command?.exclusiveCommands}`);
		isMessageValid = false;
	}

	return isMessageValid;
};