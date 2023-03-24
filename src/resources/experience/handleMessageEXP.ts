import type { User } from 'discord.js';
import EXP from '@resources/experience.js';
import COLLECTIONS from '@database/collections.js';
import { getCustomisations } from '@utils.js';

export default async function handleMessageEXP(user: User) {

    const Customisations = await getCustomisations();
    const { MESSAGE: { MESSAGE_EXP_GAIN } } = Customisations;

    const isInCooldown = await EXP.messageCooldown(user);
    if (isInCooldown) return;

    const randomEXP = MESSAGE_EXP_GAIN[Math.floor(Math.random() * MESSAGE_EXP_GAIN.length)] || 1;

    await COLLECTIONS.UserRank.addXp(user.id, randomEXP);
    
}