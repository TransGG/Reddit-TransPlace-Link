import REDDIT from '@resources/reddit.js';

export default async function addContributor(redditUsername: string) {

    const subreddit = await REDDIT.getSubreddit();

    const success = await subreddit.removeContributor({ name: redditUsername}).catch(() => false);
    if(success) return true
    return false

}