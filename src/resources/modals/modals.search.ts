import { MessageActionRow, TextInputComponent } from 'discord.js';
import { ResponsiveModal } from '@interactionHandling/componentBuilders.js';
import COLLECTIONS from '@database/collections.js';
import TEMPLATES from '@resources/commandTemplates.js';

export default new ResponsiveModal()
  .setCustomId('modals.search')
  .setTitle('Goto Page')
  .addComponents(
    new MessageActionRow<TextInputComponent>().addComponents(new TextInputComponent()
      .setLabel('Page Number')
      .setPlaceholder('Enter the number of the page you want to go to.')
      .setMaxLength(5)
      .setStyle('SHORT')
      .setRequired(true)
    )
  )
  .setResponse(async (interaction, _interactionHandler, _command) => {
    if (!interaction.isModalSubmit()) return;
    if(!interaction.guild) return;
    
    await interaction.deferReply({ ephemeral: true });

    const PAGE_STRING = interaction.components[0]?.components[0]?.value as string;

    if (!PAGE_STRING || PAGE_STRING && !/^\d+$/.test(PAGE_STRING)) interaction.followUp({
        content: 'Please input a valid page number.',
        ephemeral: true
    });
    else {
        const lastPage = await COLLECTIONS.UserRank.getMaxLeaderboardPages();

        if(parseInt(PAGE_STRING) > lastPage) interaction.followUp({
            content: 'That page does not exist.\n> The last page is: ' + lastPage + '.',
            ephemeral: true
        });
        else if (parseInt(PAGE_STRING) < 1) interaction.followUp({
            content: 'That page does not exist.\n> The first page is: 1.',
            ephemeral: true
        });
        else {
            const MESSAGE_ID = interaction.components[0]?.components[0]?.customId as string;

            // edit the message with an ID of interaction.customId
            const MESSAGE = await interaction.channel?.messages.fetch(MESSAGE_ID);
        
            if(!MESSAGE) interaction.followUp({
                content: 'The message you are trying to edit does not exist.',
                ephemeral: true
            })
            else {
                MESSAGE.edit({
                    embeds: [await TEMPLATES.getLeaderboard(interaction.guild, parseInt(PAGE_STRING))],
                });
        
                interaction.followUp({
                    content: 'Page changed to: ' + PAGE_STRING,
                    ephemeral: true
                });
            }
        }
    }
  });
