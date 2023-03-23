import { MessageEmbed, Guild } from 'discord.js';

export default async function leaderboard(guild: Guild, leaderboard: Array<{userID: number, xp: number}>, page: number, userId?: string) {
  const EMBED = new MessageEmbed()
    .setColor('#0099ff')
    .setAuthor({
        name: 'Leaderboard',
    })
    .setTitle(guild.name)
    .setThumbnail(guild.iconURL({ dynamic: true }) || '')
    .setDescription(leaderboard.map((user, index) => {
      let level = 0;
      let levelEnd = 35;
      
      if (user.xp > 34) {
        level = Math.max(0, Math.floor(Math.sqrt((user.xp - 35) / 20) + 1));
        levelEnd = 20 * (level ** 2) + 35;
      }

      return `#${((page - 1 ) * 10) + index + 1} ➡️ <@${user.userID}>\n\tLevel \`${level}\`\n\t\`${user.xp}/${levelEnd}\`\n${userId == user.userID.toString() ? "❗ __***You are here***__ ❗\n" : ""}`
    }).join('\n'))
    .setFooter({
        text: `Page ${page}`,
    })
    .setTimestamp()

  return EMBED;
}