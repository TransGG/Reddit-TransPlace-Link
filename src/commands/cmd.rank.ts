import { ResponsiveSlashCommandBuilder } from '@interactionHandling/commandBuilders.js';
import TEMPLATES from '@resources/commandTemplates.js';

export default new ResponsiveSlashCommandBuilder()
  .setName('rank')
  .setDescription('View Your Rank, or the Rank of a User.')
  .addUserOption(option =>
    option
      .setName('user')
      .setDescription('The User to View the Rank of.')
      .setRequired(false),
  )
  .setDefaultPermission(true)
  .setResponse(async (interaction, _interactionHandler, _command) => {
    if (!interaction.isApplicationCommand()) return;

    const TargetUser = interaction.options.getUser('user') || interaction.user;
    if (!TargetUser) return interaction.reply({
      content: 'Invalid User Provided.',
      ephemeral: true,
    });

    return await interaction.reply({
      embeds: [await TEMPLATES.getUserRank(TargetUser)],
    });
    
  });
