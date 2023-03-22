import type { User } from 'discord.js';
import EMBED from '@resources/embeds.js';
import EXP from '@resources/experence';

export default async function getUserRank(user: User) {
    const generatedEmbed = EMBED.rank(await EXP.getUserStats(user));
    return generatedEmbed;

}