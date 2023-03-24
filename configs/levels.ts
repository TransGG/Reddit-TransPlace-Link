import type levels from './levelsType';

const config: levels = {
  instructions: [{
    level: 1,
    action: "add",
    title: 'Give Newbie Role',
    roleID: '1085261027807088710',
    active: true,
  },
  {
    level: 3,
    action: "remove",
    title: 'Remove Newbie Role',
    roleID: '1085261027807088710',
    active: true,
  },
  {
    level: 6,
    action: "add",
    title: 'add Trusted Role',
    roleID: '996775840211800196',
    active: true,
  }]
};

export default config;
