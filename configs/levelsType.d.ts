type levelType = {
  level: number;
  action: string;
  title: string;
  roleID: string;
  active: boolean;
}

export default interface levelsType {
  instructions: levelType[];
}
