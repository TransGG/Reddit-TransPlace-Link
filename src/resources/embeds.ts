import path from 'node:path';
import chokidar from 'chokidar';
import { getDirectoryFromFileURL, getModulesInFolder } from '@utils.js';
import rank from './embeds/embeds.rank.js';
import leaderboard from './embeds/embeds.leaderboard.js';

const EMBEDS = {
  rank,
  leaderboard,
};

// TODO: a more centralised way to reload?
const EMBEDS_FOLDER = path.join(getDirectoryFromFileURL(import.meta.url), 'embeds');
chokidar.watch(EMBEDS_FOLDER).on('change', async path => {
  if (!path.endsWith('.js')) return;
  (await getModulesInFolder(EMBEDS_FOLDER)).forEach(array =>
    Reflect.set(EMBEDS, <string>array[0].split('.')[1], array[1]));
});

export default EMBEDS;