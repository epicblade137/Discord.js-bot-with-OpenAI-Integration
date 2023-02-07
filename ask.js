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
        .setName('ask')
        .setDescription('Ask a question to artifical intelligence.')
        .addStringOption(option => option.setName("query").setDescription('Specify...')),
    async execute(interaction) {
        try {

            const query = interaction.options.getString("query") ?? ""
            const mention = `<@${interaction.user.id}>`;

            if (!query) {
                await interaction.reply({ content: `${mention}, Please input a query!`, ephemeral: true })
                return;
            }

            await interaction.deferReply({ ephemeral: false });

            const completion = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: `${query}`,
                temperature: 0.9,
                max_tokens: 54,
                stop: ["Open Bot"]
            });

            const response = completion.data.choices[0].text;

            console.log(`${query}\n${response}`);

            await interaction.editReply({ content: `_"${query}"_ ${response}`, ephemeral: false });
            return;

        } catch (err) {
            interaction.reply({ content: "The AI chat service is currently unavailable, try again later!", ephemeral: true });
            console.error(err);
            return;
        };
    }
};