import { MessageEmbed, User } from 'discord.js';
import { getCustomisations } from '@utils.js';
import COLLECTIONS from '@database/collections.js';

type Options = {
  user: User,
  xp: number,
  level: number,
  levelStart: number,
  levelEnd: number,
};

export default async function rank(options: Options) {
  const progress = Math.floor(((options.xp - options.levelStart) / (options.levelEnd - options.levelStart)) * 100);

  const { EXP: { EXP_BAR_SIZE } } = await getCustomisations();

  const filledChars = Math.round(EXP_BAR_SIZE * (progress / 100));
  const emptyChars = EXP_BAR_SIZE - filledChars;
  const progressBar = "[" + "■".repeat(filledChars) + " ".repeat(emptyChars) + "]";
  
  const serverRank = await COLLECTIONS.UserRank.getServerRank(options.user.id);

  const EMBED = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`${options.user.tag}'s Rank`)
    .setThumbnail(options.user.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: 'Server Rank', value: `#${serverRank}`, inline: true },
      { name: 'Level', value: `${options.level}`, inline: true },
      { name: 'EXP', value: `${options.xp} / ${options.levelEnd} (${progress}%)\n\`${progressBar}\``, inline: false },
    )
    .setTimestamp();

  return EMBED;
}