import { ResponsiveSlashCommandBuilder } from '@interactionHandling/commandBuilders.js';
import COLLECTIONS from '@database/collections.js';
import https from 'https';

export default new ResponsiveSlashCommandBuilder()
  .setName('import')
  .setDescription('Import and Replace the Database.')
  .addAttachmentOption(option =>
    option
        .setName('database')
        .setDescription('The file to replace the database with.')
        .setRequired(true),
    )
  .setDefaultPermission(false)
  .setResponse(async (interaction, _interactionHandler, _command) => {
    if (!interaction.isCommand()) return;

    const Database = interaction.options.getAttachment('database');

    if(Database?.contentType !== 'application/json; charset=utf-8') return interaction.reply({
        content: 'Invalid File Type. Please provide a JSON file.',
        ephemeral: true,
    });

    https.get(Database.url, (res) => {
        let data: string = '';
      
        res.on('data', (chunk) => {
          data += chunk;
        });
      
        res.on('end', async () => {
          const jsonData: any = JSON.parse(data);

          if (
            !Array.isArray(jsonData) ||
            jsonData.length === 0 ||
            !jsonData.every((obj: any) => obj.userID && obj.xp)
          ) {
            return interaction.reply({
              content: 'Invalid Database. Please provide a valid JSON file.',
              ephemeral: true,
            });
          }

          const update = await COLLECTIONS.UserRank.importDatabase(jsonData);

            update.old = update.old.map((obj: any) => {
                delete obj._id;
                return obj;
            });

          return interaction.reply({
            content: `Imported Database of ${update.new.length} Users.\n> Attached Previous DB Backup \`${+new Date()}_db_backup.json\``,
            files: [{
                attachment: Buffer.from(JSON.stringify(update.old, null, 2)),
                name: `${+new Date()}_db_backup.json`,
            }],
            ephemeral: true,
          });
        });
      }).on('error', (err) => {
        return interaction.reply({
            content: `Error:\n\`\`\`${err.message}\`\`\``,
            ephemeral: true,
          });
      });    
  });
