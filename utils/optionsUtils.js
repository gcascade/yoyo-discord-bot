/**
 * Find the command options with their associated value in the list of arguments
 * @param {*} args the list of arguments
 * @param {*} options the command options
 * @returns a list of object
 */
exports.parseCommandArguments = function(args, options) {
	const result = [];

	if (!args || !args[0] || !options || !options[0]) {
		return result;
	}

	let optionArgument = { args: [] };
	const argsWithoutOption = { args: [] };
	let newOption = false;
	for (const arg of args) {
		if (arg.startsWith('-')) {
			const option = options.find(opt => opt.value === arg || (opt.aliases && opt.aliases.includes(arg)));

			if (!option) {
				throw `Unknown option: ${arg}`;
			}
			newOption = true;
			optionArgument.option = option;

			if (!option.additionalParameter) {
				result.push(optionArgument);
				newOption = false;
				optionArgument = { args: [] };
			}
		}
		else if (newOption) {
			optionArgument.args.push(arg);
			result.push(optionArgument);
			optionArgument = { args: [] };
			newOption = false;
		}
		else {
			argsWithoutOption.args.push(arg);
		}
	}

	result.push(argsWithoutOption);

	return result;
};

/**
 * Search if an option exists in the list of options
 * @param {*} optionArguments { args : [], option: { name:'value'}}
 * @param {*} optionName name of the option
 * @returns true or false
 */
exports.includesOption = function(optionArguments, optionName) {
	if (optionArguments.length === 0) {
		return false;
	}
	return optionArguments.filter(list => list.option).map(list => list.option).some(opt => opt.name && opt.name === optionName);
};

exports.getOptionArg = function(optionArguments, optionName) {
	if (!optionName) {
		return;
	}
	return optionArguments.filter(list => list.option).find(optionArg => optionArg.option.name == optionName);
};