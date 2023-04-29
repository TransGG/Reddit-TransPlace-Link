export default interface snowflakeMap {
  /**
   * Only used when registering commands. If global commands are enabled then
   * this is not needed
   */
  Discord_Guilds?: string[];
    
  /**
   * Required role to unlink a Reddit account from a Discord account.
   */
  Staff_Roles: string[];

  /**
   * Required role to link a Reddit account to a Discord account.
   */
  Verified: string;

  /**
   * Required channel to log all bot actions.
   */
   Log_Channel: string;
}
