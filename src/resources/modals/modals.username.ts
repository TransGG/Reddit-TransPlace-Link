import { MessageActionRow, TextInputComponent } from 'discord.js';
import { ResponsiveModal } from '@interactionHandling/componentBuilders.js';
import COLLECTIONS from '@database/collections.js';
import REDDIT from '@resources/reddit.js';
import { getSnowflakeMap } from '@utils.js';

export default new ResponsiveModal()
  .setCustomId('modals.search')
  .setTitle('Link Reddit Account')
  .addComponents(
    new MessageActionRow<TextInputComponent>().addComponents(new TextInputComponent()
      .setLabel('Reddit Username')
      .setPlaceholder('Please enter your Reddit username.')
      .setMaxLength(22)
      .setPlaceholder('u/username_here')
      .setStyle('SHORT')
      .setRequired(true)
    )
  )
  .setResponse(async (interaction, _interactionHandler, _command) => {
    if (!interaction.isModalSubmit()) return;
    if(!interaction.guild) return;
    
    await interaction.deferReply({ ephemeral: true });

    const USERNAME_INPUT = interaction.components[0]?.components[0]?.value as string;
    
    if (!/^u?\/?[A-Za-z0-9_-]+$/.test(USERNAME_INPUT)) {
        interaction.editReply({
            content: '***ERROR:*** *Invalid Reddit username.*\n> Please make sure you have entered a valid Reddit username.\n\`\`\`Example: u/username_here\`\`\`',
        });
    }else {
        const USERNAME = USERNAME_INPUT.startsWith('u/') ? USERNAME_INPUT.slice(2) : USERNAME_INPUT;

        const USER = await COLLECTIONS.Connections.getUserByRedditUsername(USERNAME);
        const SNOWFLAKE_MAP = await getSnowflakeMap();    

        if (USER && USER.discord) {
            interaction.editReply({
                content: '***ERROR:*** *This Reddit account is already linked to another Discord account.*\n> If you believe this is an error, please contact a moderator via a mod-ticket.',
            });
        }else {
            await COLLECTIONS.Connections.setRedditUsername(interaction.user.id, USERNAME);

            const addUser = await REDDIT.addContributor(USERNAME);
            if (!addUser) {
                interaction.editReply({
                    content: '***ERROR:*** *Failed to add you as a contributor to our Reddit.*\n> Please contact a moderator via a mod-ticket.',
                });
            } else {
                await COLLECTIONS.Connections.setRedditUsername(interaction.user.id, USERNAME);

                await interaction.editReply({
                    content: '***SUCCESS:*** *Your Reddit account has been linked to your Discord account.*\n> You can now post on our Reddit. (Please allow up to a few minutes for you to receive access)\nNOTE: If you are banned or you leave our Discord server, you will also be unverified in our Reddit.\nYou cannot link another account, or edit your linked account without contacting a moderator via a mod-ticket.\`\`\`Linked Reddit account = u/' + USERNAME + '\`\`\`',
                });

                const LOG_CHANNEL = _interactionHandler.client.channels.cache.get(SNOWFLAKE_MAP.Log_Channel); 

                if(!LOG_CHANNEL || !LOG_CHANNEL.isText()) return;
                LOG_CHANNEL?.send(`Event: \`Reddit Link\`Added user to Reddit: u/${USERNAME}, Discord: ${interaction.user.id}`)
            }
        }
    }
  });
