module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`I am online! Logged in as ${client.user.tag}`);
	},
};