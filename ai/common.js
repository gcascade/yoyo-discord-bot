const openAiAsk = require('../ai/openai/openai').ask;

exports.ask = async function (prompt) {
    if (!prompt) {
        return
    }
    if (process.env.AI === 'OPENAI') {
        return openAiAsk(prompt);
    }
}