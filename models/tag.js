const mongoose = require('mongoose');

const tag = new mongoose.Schema({
	userId: { type: String, require: true },
	serverId: { type: String, require: true },
	name: { type: String, require: true },
	description: { type: String, require: true },
});

const model = mongoose.model('Tag', tag);

module.exports = model;