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
	}],
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

			const embed = new MessageEmbed()
				.setColor(color.white)
				.setTitle(result.title)
				.setURL(result.fullurl)
				.setAuthor({ name: 'Wikipedia', iconURL: 'https://en.wikipedia.org/static/images/project-logos/enwiki.png', url: wikiMainUrl })
				.setDescription(description)
				.setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/OOjs_UI_icon_logo-wikipedia.svg/480px-OOjs_UI_icon_logo-wikipedia.svg.png')
				.addFields(
					{ name: 'Read more', value: result.fullurl },
					{ name: '\u200B', value: '\u200B' },
				)
				.setImage(mainImage)
				.setTimestamp(result.touched)
				.setFooter({ text: 'Last edited', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/OOjs_UI_icon_logo-wikipedia.svg/480px-OOjs_UI_icon_logo-wikipedia.svg.png' });

			for (let i = 0; i < sections.length && i < 3; i++) {
				if (sections[i] && sections[i].title) {
					embed.addField(sections[i].title, `${result.fullurl}#${sections[i].title.replace(' ', '_')}`, true);
				}
			}
			message.channel.send({ embeds: [embed] });

		}
		catch (error) {
			await message.reply(`${error}`);
		}
	},
};

function getWikiUrl(argOptions) {
	const defaultLang = process.env.DEFAULT_WIKI_LANG ? process.env.DEFAULT_WIKI_LANG : 'en';

	let lang;

	if (includesOption(argOptions, 'language')) {
		lang = getOptionArg(argOptions, 'language').args[0];
	}
	if (!lang) {
		lang = defaultLang;
	}

	return wikiUrl[lang];
}