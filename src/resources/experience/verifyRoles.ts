import type { GuildMember } from 'discord.js';
import EXP from '@resources/experience.js';
import { getLevels } from '@utils.js';

export default async function verifyRoles(guildMember: GuildMember) {

    const { level } = await EXP.getUserStats(guildMember.user);

    const levels = await getLevels();

    const instructions = levels.instructions.reduce((acc: any[], instruction) => {
        // If this roleID has already been added, remove it from the accumulated instructions
        const existingInstructionIndex = acc.findIndex(existingInstruction => existingInstruction.roleID === instruction.roleID);
        if (existingInstructionIndex !== -1) {
          acc.splice(existingInstructionIndex, 1);
        }
        
        // Add the current instruction to the accumulated instructions
        acc.push(instruction);
        return acc;
      }, []).filter(instruction => instruction.level <= level);
      
    const roleIDsToAdd = instructions.filter(instruction => instruction.action === 'add').map(instruction => instruction.roleID);
    const roleIDsToRemove = instructions.filter(instruction => instruction.action === 'remove').map(instruction => instruction.roleID);
      

    // Get all role IDs that the user currently has
    const userRoleIDs = new Set(guildMember.roles.cache.map(role => role.id));

    // Add the roles that they should have at this level
    roleIDsToAdd.forEach(roleID => {
        if (!userRoleIDs.has(roleID)) {
            console.log(roleID)
            guildMember.roles.add(roleID);
            console.log(`Added role ${roleID} to ${guildMember.user.tag}!`);
        }
    });

    // Remove the roles that they should not have at this level
    roleIDsToRemove.forEach(roleID => {
        if (userRoleIDs.has(roleID)) {
            guildMember.roles.remove(roleID);
            console.log(`Removed role ${roleID} from ${guildMember.user.tag}!`);
        }
    });

    
    
}