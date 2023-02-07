const { Client, ActivityType, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const TOKEN = YOUR_TOKEN_HERE
const spacer = '#######';

const type = ActivityType.Listening;
const activity = "Music";

const client = new Client({ intents: ['Guilds', 'GuildMessages', 'MessageContent'] });

client.commands = new Collection();
for (const folder of fs.readdirSync('./commands')) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.data.name, command);
    }
};

client.once('ready', () => {

    (async id => {
        console.log(`# Succesfully logged in as ${client.user.tag}!
# Currently running at: ${client.ws.ping}ms
# Server time: ${new Date().toLocaleString()}
# Bot is connected to (${client.guilds.cache.size}) servers:`);

        id = 0;

        await client.guilds.cache.forEach((g) => {
            ++id; console.log(`# (${id}) - ${g.name} (${g.client.ws.ping}ms)`);
        });

        console.log(spacer);

        return;
    })();

    client.user.setPresence({ activities: [{ name: activity, type: type }] });
});

client.on('interactionCreate', async (interaction) => {

    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);


    if (!command) {
        return console.error('# error: command not found!');
    };

    try {

        await command.execute(interaction);
    } catch (err) {

        console.error(err);
        await interaction.reply({ content: '# error: there was an error while executing your command!', ephemeral: true });
    };
});

(async () => {
    try {
        console.log(`${spacer}
# Esablishing login request, stand by...`);
        await client.login(TOKEN);
    } catch (err) {
        console.error(`${err}
# There was an error logging in!`);
    };
})();