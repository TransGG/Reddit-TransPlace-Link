import type { User } from 'discord.js';
import { getCustomisations } from '@utils.js';

const cooldown = new Set();

export default async function checkSet(user: User) {

    const Customisations = await getCustomisations();
    const { MESSAGE: { MESSAGE_EXP_COOLDOWN } } = Customisations;
    
    if (cooldown.has(user.id)) return true;
    cooldown.add(user.id);
    setTimeout(() => {
        cooldown.delete(user.id);
    }, MESSAGE_EXP_COOLDOWN * 1000);

    return false;
}