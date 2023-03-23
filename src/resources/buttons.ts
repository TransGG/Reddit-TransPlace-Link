import path from 'node:path';
import chokidar from 'chokidar';
import { getDirectoryFromFileURL, getModulesInFolder } from '@utils.js';
import previous from './buttons/buttons.previous.js';
import next from './buttons/buttons.next.js';
import search from './buttons/buttons.search.js';
import pins from './buttons/buttons.pins.js';

const BUTTONS = {
  previous,
  next,
  search,
  pins
};

// TODO: a more centralised way to reload?
const BUTTONS_FOLDER = path.join(getDirectoryFromFileURL(import.meta.url), 'buttons');
chokidar.watch(BUTTONS_FOLDER).on('change', async path => {
  if (!path.endsWith('.js')) return;
  (await getModulesInFolder(BUTTONS_FOLDER)).forEach(array =>
    Reflect.set(BUTTONS, <string>array[0].split('.')[1], array[1]));
});

export default BUTTONS;