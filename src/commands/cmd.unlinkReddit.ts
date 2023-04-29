import _ from 'lodash';
import { ResponsiveSlashCommandBuilder } from '@interactionHandling/commandBuilders.js';
import { getSnowflakeMap } from '@utils.js';
import COLLECTIONS from '@database/collections.js';
import REDDIT from '@resources/reddit.js';

export default new ResponsiveSlashCommandBuilder()
  .setName('unlink-reddit')
  .setDescription('Unlink a Reddit account from a users Discord account.')
  .setDefaultPermission(false)
    .addUserOption(option => option
        .setName('username')
        .setDescription('The discord user to unlink the reddit of.')
        .setRequired(true)
    )
  .setResponse(async (interaction, _interactionHandler, _command) => {
    if (!interaction.isApplicationCommand()) return;
    if (!interaction.member) return;

    const SNOWFLAKE_MAP = await getSnowflakeMap();
    
    // make sure interaction.member.roles is of type GuildMemberRoleManager
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    if (!member) return;

    if (!member.roles.cache.hasAny(...SNOWFLAKE_MAP.Staff_Roles)) {
        return interaction.reply({
            content: '***ERROR:*** *You do not have permission to use this command.*\n> If you believe this is an error, please contact a moderator via a mod-ticket.',
            ephemeral: true,
        });
    }

    const USER = interaction.options.getUser('username');
    if (!USER) return;

    const USER_CONNECTIONS = await COLLECTIONS.Connections.getUserByDiscordID(USER.id);
    if (!USER_CONNECTIONS || !USER_CONNECTIONS.reddit) {
        return interaction.reply({
            content: '***ERROR:*** *This user does not have a linked Reddit account.*\n> If you believe this is an error, please contact a moderator via a mod-ticket.',
            ephemeral: true,
        });
    }

    await COLLECTIONS.Connections.unlinkRedditFromDiscord(USER.id);
    await REDDIT.removeContributor(USER_CONNECTIONS.reddit);

    await interaction.reply({
        content: `***SUCCESS:*** *The Reddit account ${USER_CONNECTIONS.reddit} has been unlinked from the Discord account ${USER.tag}.*`,
        ephemeral: true,
    });

  });
