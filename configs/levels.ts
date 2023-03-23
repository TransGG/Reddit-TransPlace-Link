import type levels from './levelsType';

const config: levels = {
  instructions: [{
    level: 1,
    action: "add",
    title: 'Give at level 1',
    roleID: '1088451665977417728',
    active: true,
  },
  {
    level: 1,
    action: "remove",
    title: 'Remove at level 1',
    roleID: '1088451785192124446',
    active: true,
  },
  {
    level: 3,
    action: "add",
    title: 'Give at level 3',
    roleID: '1088451694632911018',
    active: true,
  },
  {
    level: 3,
    action: "remove",
    title: 'remove at level 3',
    roleID: '1088451665977417728',
    active: true,
  },
  {
    level: 4,
    action: "remove",
    title: 'Remove at level 4',
    roleID: '1088451745627246602',
    active: true,
  },
  {
    level: 6,
    action: "add",
    title: 'Give at level 6',
    roleID: '1088451719169577070',
    active: true,
  }]
};

export default config;
