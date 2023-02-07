const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Test command, replies with some information about ping and date.'),
    async execute(interaction) {
        try {
            const time = new Date();
            const mention = `<@${interaction.user.id}>`
            const user = interaction.user.tag;
            const server = interaction.guild;
            const ping = interaction.client.ws.ping;
            await interaction.reply(`Hello, ${mention}! Command has been used at: **${time.toLocaleString()}** on server **${server.name}**. Your ping: **${ping}ms**, bot ping: **${Math.round(interaction.client.ws.ping)}ms**`);
            console.log(`${user} has used /hello`);
        } catch (err) {
            interaction.reply("There was an error, while processing your request, try again later!");
            console.error(err);
        }
    }
}