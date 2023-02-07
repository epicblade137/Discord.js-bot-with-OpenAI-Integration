const { REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const commands = [];
const TOKEN = YOUR_TOKEN_HERE
const CLIENT_ID = YOUR_CLIENT_ID_HERE
const spacer = '#######';

for (const folder of fs.readdirSync('./commands')) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);

        commands.push(command.data.toJSON());
    }
};

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log(`${spacer}
# Started refreshing app {/} commands.`);

        const data = await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands })
        console.log(`# Commands updated succesfully!
${spacer}`);
    } catch (err) {
        console.error(`${err}
# There was an error while updating commands!`);
    }
})();