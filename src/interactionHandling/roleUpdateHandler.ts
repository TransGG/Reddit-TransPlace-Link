// imports
import type { Client, GuildMember, PartialGuildMember} from 'discord.js';
import { getSnowflakeMap } from '@utils.js';
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
      .on('guildMemberUpdate', async (oldMember, newMember) => { await this.respond(oldMember, newMember) });
  }

  public async respond(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) {

    const SNOWFLAKE_MAP = await getSnowflakeMap();    
    
    const USER = await COLLECTIONS.Connections.getUserByDiscordID(newMember.id);

    if(!USER || !USER.reddit) return 

    // check if the user is no longer verified
    if (oldMember.roles.cache.has(SNOWFLAKE_MAP.Verified) && !newMember.roles.cache.has(SNOWFLAKE_MAP.Verified)) {
      const removeUser = await REDDIT.removeContributor(USER.reddit);
      if (!removeUser) {
        console.log('Failed to remove user from Reddit')
      }
    }

  }
}