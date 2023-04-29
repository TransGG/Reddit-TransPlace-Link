// imports
import type { Client, GuildBan} from 'discord.js';
import REDDIT from '@resources/reddit.js';
import COLLECTIONS from '@database/collections.js';
import { getSnowflakeMap } from '@utils.js';

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

    const SNOWFLAKE_MAP = await getSnowflakeMap();    

    const removeUser = await REDDIT.removeContributor(USER.reddit);
    const LOG_CHANNEL = this.client.channels.cache.get(SNOWFLAKE_MAP.Log_Channel); 
    if(!LOG_CHANNEL || !LOG_CHANNEL.isText()) return;
    if (!removeUser) {
        LOG_CHANNEL?.send(`Event: \`User Ban\`\nFailed to remove user from Reddit: \`u/${USER.reddit}\`, Discord: \`${USER.discord}\``)
    }
    else {
      LOG_CHANNEL?.send(`Event: \`User Ban\`\nRemoved user from Reddit: \`u/${USER.reddit}\`, \`Discord: ${USER.discord}\``)
    }

  }
}