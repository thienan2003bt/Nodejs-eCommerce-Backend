'use strict';
require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js')

const { DISCORD_LOGGER_BOT_CHANNEL, DISCORD_LOGGER_BOT_TOKEN } = process.env;

class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ]
        })

        this.channelID = DISCORD_LOGGER_BOT_CHANNEL ?? '';
        this.client.on('ready', () => {
            console.log(`Logged as ${this.client?.user?.tag}`);
        })

        this.client.login(DISCORD_LOGGER_BOT_TOKEN ?? '')
    }

    getChannel() {
        return this.client.channels.cache.get(this.channelID);
    }

    sendToMessage(message = 'message') {
        const channel = this.getChannel();
        if (!channel) {
            console.log(`Could not find ${this.channelID} channel!`);
            return;
        }

        channel.send(message).catch(err => console.error(err))
    }


    sentToFormatCode(logData) {
        const { code, message = 'This is some information about the code', title = 'Code Example' } = logData;

        const codeMessage = {
            content: message,
            embeds: [{
                color: parseInt('00ff00', 16),
                title,
                description: '```json\n' + JSON.stringify(code, null, 2) + '\n```'
            }]
        }

        this.sendToMessage(codeMessage);
    }


}

const LoggerServiceInstance = new LoggerService();
module.exports = LoggerServiceInstance;