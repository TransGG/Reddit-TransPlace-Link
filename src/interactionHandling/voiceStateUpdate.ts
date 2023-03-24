// imports
import type { Client, VoiceState} from 'discord.js';
import EXP from '@resources/experience.js';
import { getCustomisations } from '@utils.js';

export default class MessageHandler {
  public readonly client: Client;

  /**
   * A handler to register and respond to responsive messages
   *
   * @param client         The client to use
   */
  public constructor(client: Client) {
    this.client = client
      .on('voiceStateUpdate', async i => await this.respond(i));
  }

  public async respond(state: VoiceState) {

    const Customisations = await getCustomisations();
    const { VOICE: { VOICE_EXP } } = Customisations;

    if(!state.member) return;
    if(state.member?.user.bot) return;
    if(!state.channelId && VOICE_EXP) EXP.handleVoiceEXP(state);
    
  }
}