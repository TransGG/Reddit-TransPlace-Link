import type { User } from 'discord.js';
import EXP from '@resources/experience.js';
import COLLECTIONS from '@database/collections.js';
import { getCustomisations } from '@utils.js';


export default async function handleEXP(user: User) {

    const Customisations = await getCustomisations();
    const { EXP: { EXP_GAIN } } = Customisations;

    const isInCooldown = await EXP.checkSet(user);
    if (isInCooldown) return;

    const randomEXP = EXP_GAIN[Math.floor(Math.random() * EXP_GAIN.length)] || 1;

    await COLLECTIONS.UserRank.addXp(user.id, randomEXP);
    
}