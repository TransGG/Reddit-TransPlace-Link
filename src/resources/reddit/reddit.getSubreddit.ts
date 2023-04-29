import snoowrap from 'snoowrap';
import { getCoreConf } from '@utils.js';

let redditClient : any;
let subreddit : any;

export default async function getSubreddit() {

  const CORE_CONF = await getCoreConf();

  if(!redditClient) {
    redditClient = await new snoowrap({
      userAgent: CORE_CONF.reddit.userAgent,
      clientId: CORE_CONF.reddit.clientId,
      clientSecret: CORE_CONF.reddit.clientSecret,
      refreshToken: CORE_CONF.reddit.refreshToken,
    });  
  }

  if(!subreddit) {
    subreddit = await redditClient.getSubreddit(CORE_CONF.reddit.subreddit);
  }

  return subreddit;
  
}