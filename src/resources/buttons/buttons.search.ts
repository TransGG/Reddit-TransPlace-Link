import _ from 'lodash';
import { ResponsiveMessageButton } from '@interactionHandling/componentBuilders.js';
import MODALS from '@resources/modals.js';

export default new ResponsiveMessageButton()
    .setCustomId('button.search')
    .setEmoji('🔍')
    .setStyle('PRIMARY')
    .setResponse(async (interaction, _interactionHandler, _command) => {
        if (!interaction.isButton()) return;
        if(!interaction.guild) return;

        _interactionHandler.addComponent(MODALS.search);

        const MODAL = _.cloneDeep(MODALS.search);
        MODAL.components[0]?.components[0]?.setCustomId(interaction.message.id);
    
        await interaction.showModal(MODAL);
    });
