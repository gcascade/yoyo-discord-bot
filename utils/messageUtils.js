function getUsersFromMention(client, message) {
	if (!message || !message.mentions) return [];

	const users = [];

	message.mentions.users.forEach((user) => {
		users.push(client.users.cache.get(user.id));
	});
	
	return users;
}

function botWasMentioned(client, message) {
	const users = getUsersFromMention(client, message);
	return users.some(user => user && user.id === client.user.id);
}

module.exports = {
    getUsersFromMention,
    botWasMentioned,
};