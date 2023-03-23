import TEMPLATES from '@resources/commandTemplates.js';
import COLLECTIONS from '@database/collections.js';
import { ResponsiveMessageButton } from '@interactionHandling/componentBuilders.js';

export default new ResponsiveMessageButton()
    .setCustomId('button.pins')
    .setEmoji('📌')
    .setStyle('PRIMARY')
    .setResponse(async (interaction, _interactionHandler, _command) => {
        if (!interaction.isButton()) return;
        if(!interaction.guild) return;

        const userPage = await COLLECTIONS.UserRank.findPageByUserId(interaction.user.id);

        if(!userPage) return interaction.reply({
            content: 'Cannot find the page you are on.',
        });

        return interaction.update({
            embeds: [await TEMPLATES.getLeaderboard(interaction.guild, userPage, interaction.user.id)],
        });

    });
