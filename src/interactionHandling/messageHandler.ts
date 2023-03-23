// imports
import type { Client, Message} from 'discord.js';
import EXP from '@resources/experience.js';

export default class MessageHandler {
  public readonly client: Client;

  /**
   * A handler to register and respond to responsive messages
   *
   * @param client         The client to use
   */
  public constructor(client: Client) {
    this.client = client
      .on('messageCreate', async i => await this.respond(i));
  }

  public async respond(message: Message) {

    if (message.author.bot) return;

    EXP.handleEXP(message.author);
    if(message.member) EXP.verifyRoles(message.member);
    
  }
}