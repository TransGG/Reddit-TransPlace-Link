import _ from 'lodash';
import { ResponsiveSlashCommandBuilder } from '@interactionHandling/commandBuilders.js';
import TEMPLATES from '@resources/commandTemplates.js';
import BUTTONS from '@resources/buttons.js';
import { MessageActionRow } from 'discord.js';

export default new ResponsiveSlashCommandBuilder()
  .setName('leaderboard')
  .setDescription('View the Server Leaderboard.')
  .setDefaultPermission(true)
  .setResponse(async (interaction, _interactionHandler, _command) => {
    if (!interaction.isApplicationCommand()) return;

    const guild = interaction.guild;
    if (!guild) return;

    _interactionHandler.addComponent(BUTTONS.previous);
    _interactionHandler.addComponent(BUTTONS.search);
    _interactionHandler.addComponent(BUTTONS.pins);
    _interactionHandler.addComponent(BUTTONS.next);

    let row = new MessageActionRow()
      .addComponents(BUTTONS.previous)
      .addComponents(BUTTONS.search)
      .addComponents(BUTTONS.pins)
      .addComponents(BUTTONS.next);

    return await interaction.reply({
        embeds: [await TEMPLATES.getLeaderboard(guild)],
        components: [row],
    });
  });
