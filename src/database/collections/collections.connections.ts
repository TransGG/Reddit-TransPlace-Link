import _ from 'lodash';
import type { Snowflake } from 'discord.js';
import type { ObjectId } from 'mongodb';
import DATABASE from '../database.js';

const DATABASE_COLLECTION = DATABASE.collection('connections');

export default class user {
  public readonly _id?: ObjectId;
  public readonly discord: Snowflake;
  public reddit: string = '';

  public constructor(userID: Snowflake) {
    this.discord = userID;
  }

  public static async getUserByDiscordID(userID: Snowflake) {
    let DOCUMENT = await DATABASE_COLLECTION.findOne({ discord: userID });
    return DOCUMENT ?
      Object.setPrototypeOf(DOCUMENT, user.prototype) as user :
      new user(userID);
  }

  public static async getUserByRedditUsername(redditUsername: string) {
    let DOCUMENT = await DATABASE_COLLECTION.findOne({ reddit: redditUsername });
    return DOCUMENT ? Object.setPrototypeOf(DOCUMENT, user.prototype) as user : null;
  }

  public static async setRedditUsername(userID: Snowflake, redditUsername: string) {
    let USER = await this.getUserByDiscordID(userID);
    USER.reddit = redditUsername;
    await USER.update();
    return USER;
  }

  public static async unlinkRedditFromDiscord(userID: Snowflake) {
    let USER = await this.getUserByDiscordID(userID);
    USER.reddit = '';
    await USER.update();
    return USER;
  }

  private async update() {
    if (!this._id) return await DATABASE_COLLECTION.insertOne(this);
    else return await DATABASE_COLLECTION.updateOne({ _id: this._id }, { $set: this });
  }
}
