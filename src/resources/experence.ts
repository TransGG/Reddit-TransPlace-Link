import path from 'node:path';
import chokidar from 'chokidar';
import { getDirectoryFromFileURL, getModulesInFolder } from '@utils.js';
import checkSet from './experience/checkSet.js';
import handleEXP from './experience/handleEXP.js';
import getUserStats from './experience/getUserStats.js';
import verifyRoles from './experience/verifyRoles.js';

const EXP = {
    checkSet,
    handleEXP,
    getUserStats,
    verifyRoles,
};

// TODO: a more centralised way to reload?
const EXP_FOLDER = path.join(getDirectoryFromFileURL(import.meta.url), 'experience');
chokidar.watch(EXP_FOLDER).on('change', async path => {
  if (!path.endsWith('.js')) return;
  (await getModulesInFolder(EXP_FOLDER)).forEach(array =>
    Reflect.set(EXP, <string>array[0].split('.')[1], array[1]));
});

export default EXP;