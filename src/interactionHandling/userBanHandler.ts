// imports
import type { Client, GuildBan} from 'discord.js';
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
      .on('guildBanAdd', async i => { await this.respond(i) });
  }

  public async respond(banned: GuildBan) {
    
    const USER = await COLLECTIONS.Connections.getUserByDiscordID(banned.user.id);

    if(!USER || !USER.reddit) return 

    const removeUser = await REDDIT.removeContributor(USER.reddit);
    if (!removeUser) {
        console.log('Failed to remove user from Reddit')
    }

  }
}