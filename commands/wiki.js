const wiki = require('wikijs').default;
const { MessageEmbed } = require('discord.js');
const color = require('../utils/color.js');
const emojiCharacters = require('../utils/emojiCharacters.js');
const wikiUrl = require('../utils/wikiUrl.js');
const { parseCommandArguments, includesOption, getOptionArg } = require('../utils/optionsUtil');


module.exports = {
	name: 'wiki',
	description: 'Search info from a wiki',
	options: [{
		name: 'random',
		value: '-r',
		aliases: ['-random', '-rand'],
		description: 'Search for a random wiki page',
		additionalParameter: false,
	}, {
		name: 'language',
		value: '-l',
		aliases: ['-language', '-lang'],
		description: 'Set the wiki lang',
		additionalParameter: true,
	}, {
		name: 'url',
		value: '-url',
		description: 'Set the wiki url',
		additionalParameter: true,
	}],
	cooldown: 10,
	async execute(message, args) {
		if (!args[0]) {
			message.reply('Invalid query');
			return;
		}
		const argOptions = parseCommandArguments(args, this.options);

		const wikiMainUrl = getWikiUrl(argOptions);
		const apiEndUrl = '/w/api.php';
		const apiUrl = wikiMainUrl + apiEndUrl;

		try {

			let searchResult;
			if (includesOption(argOptions, 'random')) {
				searchResult = await wiki({ apiUrl: apiUrl })
					.random();
			}
			else {
				const searchParam = argOptions.filter(argOption => !argOption.option).map(argOption => argOption.args).join(' ');
				searchResult = await (await wiki({ apiUrl: apiUrl }).search(searchParam)).results[0];

				if (!searchResult) {
					message.reply(`No results ${emojiCharacters.slightlyFrowningFace}`);
				}
			}

			const result = await wiki({ apiUrl: apiUrl })
				.page(`${searchResult}`);

			// Careful, Discord does not display .svg images
			const mainImage = await result.mainImage();
			const summary = await result.summary();
			const sections = await result.sections();
			const description = summary.length > 500 ? `${summary.substring(0, 500)}...` : summary;

			const siteinfo = await wiki({ apiUrl: apiUrl }).api({ action: 'query', meta: 'siteinfo' });
			const metadata = siteinfo.query.general;

			const embed = createEmbed(result, metadata, description, mainImage, sections);
			message.channel.send({ embeds: [embed] });

		}
		catch (error) {
			await message.reply(`${error}`);
		}
	},
};

function createEmbed(wikiResult, metadata, description, mainImage, sections) {
	const embed = new MessageEmbed()
		.setColor(color.white)
		.setTitle(wikiResult.title)
		.setURL(wikiResult.fullurl)
		.setAuthor({ name: metadata.sitename, iconURL: `https:${metadata.logo}`, url: metadata.base })
		.setDescription(description)
		.setThumbnail(`https:${metadata.logo}`)
		.addFields(
			{ name: 'Read more', value: wikiResult.fullurl },
			{ name: '\u200B', value: '\u200B' },
		)
		.setImage(mainImage)
		.setTimestamp(wikiResult.touched)
		.setFooter({ text: 'Last edited', iconURL: `https:${metadata.logo}` });

	for (let i = 0; i < sections.length && i < 3; i++) {
		if (sections[i] && sections[i].title) {
			embed.addField(sections[i].title, `${wikiResult.fullurl}#${sections[i].title.replace(' ', '_')}`, true);
		}
	}
	return embed;
}

function getWikiUrl(argOptions) {
	const defaultLang = process.env.DEFAULT_WIKI_LANG ? process.env.DEFAULT_WIKI_LANG : 'en';

	let lang;

	if (includesOption(argOptions, 'url')) {
		const arg = getOptionArg(argOptions, 'url').args[0];
		if (!arg) {
			throw 'Missing url with \'-url\'';
		}
		return arg;
	}

	if (includesOption(argOptions, 'language')) {
		lang = getOptionArg(argOptions, 'language').args[0];
	}
	if (!lang) {
		lang = defaultLang;
	}

	return wikiUrl[lang];
}