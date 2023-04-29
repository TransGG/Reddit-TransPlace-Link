// imports
import type { Client, GuildMember, PartialGuildMember} from 'discord.js';
import REDDIT from '@resources/reddit.js';
import COLLECTIONS from '@database/collections.js';

export default class MessageHandler {
  public readonly client: Client;

  /**
   * A handler to register and respond to responsive messages
   *
   * @param client         The client to use
   */
  public constructor(client: Client) {
    this.client = client
      .on('guildMemberRemove', async i => { await this.respond(i) });
  }

  public async respond(member: GuildMember | PartialGuildMember) {
    
    const USER = await COLLECTIONS.Connections.getUserByDiscordID(member.id);

    if(!USER || !USER.reddit) return 

    const removeUser = await REDDIT.removeContributor(USER.reddit);
    if (!removeUser) {
        console.log('Failed to remove user from Reddit')
    }

  }
}