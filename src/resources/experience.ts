import path from 'node:path';
import chokidar from 'chokidar';
import { getDirectoryFromFileURL, getModulesInFolder } from '@utils.js';
import messageCooldown from './experience/messageCooldown.js';
import getUserStats from './experience/getUserStats.js';
import verifyRoles from './experience/verifyRoles.js';
import handleVoiceEXP from './experience/handleVoiceEXP.js';
import handleMessageEXP from './experience/handleMessageEXP.js';

const EXP = {
    messageCooldown,
    getUserStats,
    verifyRoles,
    handleMessageEXP,
    handleVoiceEXP,
};

// TODO: a more centralised way to reload?
const EXP_FOLDER = path.join(getDirectoryFromFileURL(import.meta.url), 'experience');
chokidar.watch(EXP_FOLDER).on('change', async path => {
  if (!path.endsWith('.js')) return;
  (await getModulesInFolder(EXP_FOLDER)).forEach(array =>
    Reflect.set(EXP, <string>array[0].split('.')[1], array[1]));
});

export default EXP;