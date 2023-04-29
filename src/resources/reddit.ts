import path from 'node:path';
import chokidar from 'chokidar';
import { getDirectoryFromFileURL, getModulesInFolder } from '@utils.js';
import addContributor from './reddit/reddit.addContributor.js';
import removeContributor from './reddit/reddit.removeContributor.js';
import getSubreddit from './reddit/reddit.getSubreddit.js';

const REDDIT = {
    addContributor,
    removeContributor,
    getSubreddit
};

// TODO: a more centralised way to reload?
const REDDIT_FOLDER = path.join(getDirectoryFromFileURL(import.meta.url), 'modals');
chokidar.watch(REDDIT_FOLDER).on('change', async path => {
  if (!path.endsWith('.js')) return;
  (await getModulesInFolder(REDDIT_FOLDER)).forEach(array =>
    Reflect.set(REDDIT, <string>array[0].split('.')[1], array[1]));
});

export default REDDIT;