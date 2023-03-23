import { ResponsiveSlashCommandBuilder } from '@interactionHandling/commandBuilders.js';
import TEMPLATES from '@resources/commandTemplates.js';

export default new ResponsiveSlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('View the Server Leaderboard.')
  .setDefaultPermission(true)
  .setResponse(async (interaction, _interactionHandler, _command) => {
    if (!interaction.isApplicationCommand()) return;

    const guild = interaction.guild;
    if (!guild) return;

    return await interaction.reply({
        embeds: [await TEMPLATES.getLeaderboard(guild)],
    });
  });
