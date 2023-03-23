import EMBED from '@resources/embeds.js';
import COLLECTIONS from '@database/collections.js';
import type { Guild } from 'discord.js';

export default async function getLeaderboard(guild: Guild, page: number = 1, userId?: string) {
        const leaderboard = await COLLECTIONS.UserRank.getLeaderboard(page);
        // TODO: Fix this 
        // @ts-ignore
        const generatedEmbed = EMBED.leaderboard(guild, leaderboard, page, userId);
        return generatedEmbed;
}