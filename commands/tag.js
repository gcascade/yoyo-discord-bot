const { parseCommandArguments, includesOption, getOptionArg } = require('../utils/optionsUtils');
const { oneLineCommaListsAnd } = require('common-tags');

const tagModel = require('../models/tag');
const logger = require('../utils/logger');

async function getTag(userId, serverId, name) {
	return await tagModel.findOne({ userId: userId, serverId: serverId, name: name });
}

async function getTags(userId, serverId) {
	return await tagModel.find({ userId: userId, serverId: serverId }).limit(this.limit);
}

async function createTag(userId, serverId, name, description) {
	const tag = await tagModel.create({
		userId: userId,
		serverId: serverId,
		name: name,
		description: description,
	});
	await tag.save();
	logger.info(`Added tag: userId=${userId}, serverId=${serverId}, name=${name}, description=${description}`);
}

async function updateTag(tag, description) {
	tag.description = description;
	await tag.save();
	logger.info(`Updated tag: userId=${tag.userId}, serverId=${tag.serverId}, name=${tag.name}, description=${description}`);
}

async function deleteTag(userId, serverId, name) {
	await tagModel.deleteOne({ userId: userId, serverId: serverId, name: name });
}

module.exports = {
	name: 'tag',
	description: 'Get, create, update or delete a tag',
	options: [{
		name: 'name',
		value: '-name',
		aliases: ['-n'],
		description: 'Tag name',
		additionalParameter: true,
	}, {
		name: 'description',
		value: '-desc',
		aliases: ['-description'],
		description: 'Tag description',
		additionalParameter: true,
	}, {
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
	async execute(message, args) {
		const argOptions = parseCommandArguments(args, this.options);

		try {
			const name = getOptionArg(argOptions, 'name')?.args[0];
			const description = argOptions.filter(argOption => !argOption.option).map(argOption => argOption.args.join(' ')).join();

			// Use Enums instead ?
			const add = includesOption(argOptions, 'add');
			const update = includesOption(argOptions, 'update');
			const del = includesOption(argOptions, 'delete');
			const getByName = !add && !update && !del && name;
			const getAllByUser = !getByName;

			const needsName = add || del || update;
			const needsDesc = add || update;

			const missingParams = [];

			if (needsName && !name) {
				missingParams.push('name');
			}
			if (needsDesc && !description) {
				missingParams.push('description');
			}

			if (missingParams.length > 0) {
				await message.reply(oneLineCommaListsAnd`Missing parameters: ${missingParams}`);
				return;
			}

			const userId = message.author.id;
			const serverId = message.guild.id;

			if (del) {
				const tag = await getTag(userId, serverId, name);
				if (!tag) {
					await message.reply(`Tag not found: ${name}`);
				}
				else {
					deleteTag(userId, serverId, name);
					await message.reply(`Deleted tag ${name}`);
				}
			}
			else if (add) {
				const userCommandCount = (await getTags(userId, serverId)).length;
				if (userCommandCount == this.limit) {
					await message.reply('You reached the maximum number of tags');
					return;
				}
				const tag = await getTag(userId, serverId, name);
				if (tag) {
					await message.reply(`Tag already exists: ${name}`);
					return;
				}
				await createTag(userId, serverId, name, description);
				await message.reply(`Added tag ${name}. **${this.limit - userCommandCount - 1}** tag(s) remaining`);
			}
			else if (update) {
				const tag = await getTag(userId, serverId, name);
				if (!tag) {
					await message.reply(`Tag not found: ${name}`);
				}
				await updateTag(tag, description);
				await message.reply(`Updated tag ${tag.name}`);
			}
			else if (getByName) {
				const tag = await getTag(userId, serverId, name);
				if (!tag) {
					await message.reply(`Tag not found: ${name}`);
				}
				await message.reply(`Tag ${name}: ${tag.description}`);
			}
			else if (getAllByUser) {
				const tags = await getTags(userId, serverId);
				if (tags?.length > 0) {
					await message.reply(oneLineCommaListsAnd`Your tag(s): ${tags.map(tag => tag.name)}`);
				}
				else {
					await message.reply('No tag found');
				}
			}
		}
		catch (error) {
			logger.error(error);
			await message.reply('An error occured');
		}
	},
};