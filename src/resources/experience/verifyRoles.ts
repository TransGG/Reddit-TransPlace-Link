import type { GuildMember } from 'discord.js';
import EXP from '@resources/experence';
import { getLevels } from '@utils.js';

export default async function verifyRoles(guildMember: GuildMember) {

    const { level } = await EXP.getUserStats(guildMember.user);

    const levels = await getLevels();

    // Get all instructions that are applicable to the user's level
    const instructions = levels.instructions.filter(instruction => instruction.level <= level);

    // Get all role IDs that need to be added or removed
    const roleIDsToAdd = new Set(instructions.filter(instruction => instruction.action === 'add').map(instruction => instruction.roleID));
    const roleIDsToRemove = new Set(instructions.filter(instruction => instruction.action === 'remove').map(instruction => instruction.roleID));

    // Get all role IDs that the user currently has
    const userRoleIDs = new Set(guildMember.roles.cache.map(role => role.id));

    // Add the roles that they should have at this level
    roleIDsToAdd.forEach(roleID => {
        if (!userRoleIDs.has(roleID)) {
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