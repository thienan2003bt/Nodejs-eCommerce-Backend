'use strict';
require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});


const token = process.env.DISCORD_LOGGER_BOT_TOKEN ?? '';
client.login(token);

client.on('ready', () => {
    console.log(`Logged as ${client?.user?.tag}`);
})


client.on('messageCreate', (msg) => {
    if (msg?.author?.bot) {
        return;
    }
    if (msg?.content === 'hello') {
        msg?.reply('Hello! How can i assist you today ?')
    }
})