// import stuff
import chalk from 'chalk';
import { oneLineTrim } from 'common-tags';
import { Client, Intents } from 'discord.js';
import InteractionHandler from './interactionHandling/interactionHandler.js';
import { getCommands, getCoreConf, getAdvancedConf, getSnowflakeMap, watchAndReloadCommands } from './utils.js';
import roleUpdateHandler from './interactionHandling/roleUpdateHandler.js';
import userLeaveHandler from './interactionHandling/userLeaveHandler.js';
import userBanHandler from './interactionHandling/userBanHandler.js';

const CORE_CONF = await getCoreConf();
const SNOWFLAKE_MAP = await getSnowflakeMap();

// define client
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ]
}).once('ready', () => console.log(chalk.greenBright('Logged in'))) as
  Client & { readonly interactionHandler: InteractionHandler };

// command handling
Reflect.set(client, 'interactionHandler', new InteractionHandler(
  client,
  await getCommands(),
  CORE_CONF.Global_Commands,
  SNOWFLAKE_MAP.Discord_Guilds ?? undefined
));

Reflect.set(client, 'guildMemberUpdate', new roleUpdateHandler(
  client,
));

Reflect.set(client, 'guildMemberRemove', new userLeaveHandler(
  client,
));

Reflect.set(client, 'guildBanAdd', new userBanHandler(
  client,
));

// hot reloading commands have minor performance impact for production
if ((await getAdvancedConf()).Hot_Reload_Commands) {
  console.warn(chalk.yellowBright('Hot Reload Commands is enabled'));
  watchAndReloadCommands(client.interactionHandler);
}

// TODO: put all strings in a file
// TODO: warning message to a channel when a message with a banned word is sent or edited
// TODO: command to send a message embed to a channel, warning to stop a discussion

// login
console.log(chalk.cyanBright('Logging in'));
await client.login(CORE_CONF.Discord_Bot_Token);

// on exception
process.on('uncaughtException', async e => {
  const PATH_MAPPING_EXCEPTION_MATCH = e.message.match(/Cannot find package '(@.*)' imported from (.*)/);
  PATH_MAPPING_EXCEPTION_MATCH ?
    (await getAdvancedConf()).Log_Path_Mapping_Errors ?
      console.warn(chalk.gray(
        oneLineTrim`Path mapping error:
          ${PATH_MAPPING_EXCEPTION_MATCH[1]} imported from
          ${PATH_MAPPING_EXCEPTION_MATCH[2]}`
      )) : null :
    console.error(chalk.redBright(`[unhandledException] ${e.stack ?? e}`));
});
