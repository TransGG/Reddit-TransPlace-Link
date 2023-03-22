import _ from 'lodash';
import type { Snowflake } from 'discord.js';
import type { ObjectId } from 'mongodb';
import DATABASE from '../database.js';
import { getCustomisations } from '@utils.js';

const DATABASE_COLLECTION = DATABASE.collection('user-logs');

export default class UserRank {
  public readonly _id?: ObjectId;
  public readonly userID: Snowflake;
  public xp: number;

  public constructor(userID: Snowflake) {
    this.userID = userID;
    this.xp = 0;
  }

  public static async getUser(userID: Snowflake) {
    let DOCUMENT = await DATABASE_COLLECTION.findOne({ userID });
    return DOCUMENT ?
      Object.setPrototypeOf(DOCUMENT, UserRank.prototype) as UserRank :
      new UserRank(userID);
  }

  public static async addXp(userID: Snowflake, xp: number) {
    let USER_RANK = await this.getUser(userID);
    USER_RANK.xp += xp;
    await USER_RANK.update();
    return USER_RANK;
  }

  public static async setXp(userID: Snowflake, xp: number) {
    let USER_RANK = await this.getUser(userID);
    USER_RANK.xp = xp;
    await USER_RANK.update();
    return USER_RANK;
  }

  public static async getServerRank(userID: Snowflake) {
    const USER_RANK = await this.getUser(userID);
    const SERVER_RANK = await DATABASE_COLLECTION.find({ xp: { $gt: USER_RANK.xp } }).count();
    return SERVER_RANK + 1;
  }

  public static async getLeaderboard(page = 1) {
    const { Leaderboard_Items_Per_Page } = await getCustomisations();
    const LEADERBOARD = await DATABASE_COLLECTION.find({}).sort({ xp: -1 }).skip((page - 1) * Leaderboard_Items_Per_Page).limit(Leaderboard_Items_Per_Page).toArray()
    return LEADERBOARD;
  }

  /**
   * Add the user to the database if they haven't been added before
   *
   * Updates the user if they have been added before
   */
  private async update() {
    if (!this._id) return await DATABASE_COLLECTION.insertOne(this);
    else return await DATABASE_COLLECTION.updateOne({ _id: this._id }, { $set: this });
  }
}
