import EMBED from '@resources/embeds.js';
import COLLECTIONS from '@database/collections.js';
import type { Guild } from 'discord.js';

export default async function getLeaderboard(guild: Guild) {
        const leaderboard = await COLLECTIONS.UserRank.getLeaderboard();
        // TODO: Fix this 
        // @ts-ignore
        const generatedEmbed = EMBED.leaderboard(guild, leaderboard);
        return generatedEmbed;
}