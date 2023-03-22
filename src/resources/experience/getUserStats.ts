import type { User } from 'discord.js';
import COLLECTIONS from '@database/collections.js';

export default async function getUserStats(user: User) {

    // FORMULA FOR LEVELING UP: 20 * ((level - 1) ** 2) + 35
    const { xp } = await COLLECTIONS.UserRank.getUser(user.id);

    let level = 0;
    let levelStart = 0;
    let levelEnd = 35;
    
    if (xp > 34) {
      level = Math.max(0, Math.floor(Math.sqrt((xp - 35) / 20) + 1));
      levelStart = 20 * ((level - 1) ** 2) + 35;
      levelEnd = 20 * (level ** 2) + 35;
    }

    const stats = {
        user: user,
        xp: xp,
        level: level,
        levelStart: levelStart,
        levelEnd: levelEnd,
    };

    return stats;

}