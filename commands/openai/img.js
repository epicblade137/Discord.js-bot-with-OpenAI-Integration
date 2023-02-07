const { SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const OPENAI_ORG = YOUR_OPENAI_ORG_KEY
const OPENAI_KEY = YOUR_OPENAI_KEY

const configuration = new Configuration({
    organization: OPENAI_ORG,
    apiKey: OPENAI_KEY
});

const openai = new OpenAIApi(configuration);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('img')
        .setDescription('Generate an image through AI.')
        .addStringOption(option => option.setName("query").setDescription('Specify...').setRequired(true))
        .addStringOption(option => option
            .setName("size")
            .setDescription("Choose the size, default 256x256.")
            .setRequired(false)
            .addChoices(
                {
                    name: "256x256",
                    value: "256x256"
                },
                {
                    name: "512x512",
                    value: "512x512"
                },
                {
                    name: "1024x1024",
                    value: "1024x1024"
                })),

    async execute(interaction) {
        try {

            const query = interaction.options.getString("query") ?? ""
            const size = interaction.options.getString("size") ?? "256x256"
            const mention = `<@${interaction.user.id}>`;

            if (!query) {
                await interaction.reply({ content: `${mention}, Please input a query!`, ephemeral: true })
                return;
            }
            await interaction.deferReply({ ephemeral: false });

            const completion = await openai.createImage({
                prompt: `${query}`,
                n: 1,
                size: `${size}`
            });

            const response = completion.data.data[0].url;

            console.log(`${response}`);

            await interaction.editReply({ content: `${response}`, ephemeral: false });
            await interaction.followUp({ content: `**This is an example of: **_"${query}"_` })
            return;
        } catch (err) {
            interaction.editReply({ content: "The AI chat service is currently unavailable, try again later!", ephemeral: true });
            console.error(err);
            return;
        };
    }
};