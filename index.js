const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('clientReady', () => {
    console.log(`Bot online como ${client.user.tag}`);
});

require('./estoque')(client);
require('./painel')(client);
require('./comandos')(client);

client.login('MEU TOKEN'); const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Bot online');
});

app.listen(3000);