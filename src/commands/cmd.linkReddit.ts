import _ from 'lodash';
import { ResponsiveSlashCommandBuilder } from '@interactionHandling/commandBuilders.js';
import MODALS from '@resources/modals.js';
import COLLECTIONS from '@database/collections.js';
import { getSnowflakeMap } from '@utils.js';

export default new ResponsiveSlashCommandBuilder()
  .setName('link-reddit')
  .setDescription('Link your Discord to our Reddit, allowing post access.')
  .setDefaultPermission(true)
  .setResponse(async (interaction, _interactionHandler, _command) => {
    if (!interaction.isApplicationCommand()) return;
    if(!interaction.member) return 

    _interactionHandler.addComponent(MODALS.username);

    const guild = interaction.guild;
    if (!guild) return;

    // Check if this user has already linked their Reddit account
    const USER = await COLLECTIONS.Connections.getUserByDiscordID(interaction.user.id);
    if (USER && USER.reddit) {
      return interaction.reply({
        content: '***ERROR:*** *You have already linked your Reddit account.*\n> If you would like to change your linked Reddit account, please contact a moderator via a mod-ticket.\n\`\`\`Linked Reddit account = ' + USER.reddit + '\`\`\`',
        ephemeral: true,
      });
    }

    const SNOWFLAKE_MAP = await getSnowflakeMap();

    const member = await interaction.guild?.members.fetch(interaction.user.id);

    // Make sure the user has the Verified role
    if (!member.roles.cache.has(SNOWFLAKE_MAP.Verified)) return interaction.reply({
      content: '***ERROR:*** *You must be verified to link your Reddit account.*\n> If you believe this is an error, please contact a moderator via a mod-ticket.',
      ephemeral: true,
    });

    const MODAL = _.cloneDeep(MODALS.username);
    MODAL.components[0]?.components[0]?.setCustomId('linkReddit_' + interaction.user.id);

    await interaction.showModal(MODAL);

  });
