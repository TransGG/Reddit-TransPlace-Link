export default interface core {
  Discord_Bot_Token: string,
  MongoDB_URI: string,
  Global_Commands: boolean,
  reddit: {
    userAgent: string,
    clientId: string,
    clientSecret: string,
    refreshToken: string,
    subreddit: string,
  }
}
