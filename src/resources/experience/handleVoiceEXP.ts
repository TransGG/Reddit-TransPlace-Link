import type { VoiceState, } from 'discord.js';
import { getCustomisations } from '@utils.js';
import COLLECTIONS from '@database/collections.js';

const cooldown = new Set();

export default async function handleVoiceEXP(state: VoiceState) {

    if(!state.member) return;

    const Customisations = await getCustomisations();
    const { VOICE: { VOICE_EXP_GAIN, VOICE_EXP_COOLDOWN } } = Customisations;

    if (cooldown.has(state.member.id)) return;
    cooldown.add(state.member.id);

    const checkVoice = setInterval(() => {

        if(!state.member?.voice.channel) {
            clearInterval(checkVoice);
            if(state.member?.id) cooldown.delete(state.member.id);
            return
        }

        const randomEXP = VOICE_EXP_GAIN[Math.floor(Math.random() * VOICE_EXP_GAIN.length)] || 1;

        COLLECTIONS.UserRank.addXp(state.member.id, randomEXP);
        
        console.log(`Added ${randomEXP} to ${state.member.user.tag} (${state.member.id})`);
        
    }, VOICE_EXP_COOLDOWN * 1000);

     return;
}