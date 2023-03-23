import TEMPLATES from '@resources/commandTemplates.js';
import COLLECTIONS from '@database/collections.js';
import { ResponsiveMessageButton } from '@interactionHandling/componentBuilders.js';

export default new ResponsiveMessageButton()
    .setCustomId('button.previous')
    .setEmoji('⬅️')
    .setStyle('PRIMARY')
    .setResponse(async (interaction, _interactionHandler, _command) => {
        if (!interaction.isButton()) return;
        if(!interaction.guild) return;
        const page = interaction.message.embeds[0]?.footer?.text.split(" ")[1] as string;

        const lastPage = await COLLECTIONS.UserRank.getMaxLeaderboardPages();

        if(!page) return interaction.reply({
            content: 'No page number found.',
        });

        const newPage = page === '1' ? lastPage : parseInt(page) - 1;

        return interaction.update({
            embeds: [await TEMPLATES.getLeaderboard(interaction.guild, newPage)],
        });

    });
