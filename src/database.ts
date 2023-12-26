import { MongoClient, Db } from "mongodb";

export class Database {
  private static mongoClient: MongoClient;

  private constructor() {}

  static async initilize() {
    this.mongoClient = await MongoClient.connect(
      "mongodb+srv://guezmirissam:98986476@cluster0.krkpf7f.mongodb.net/?retryWrites=true&w=majority"
    );
  }

  

  static getDb() {
    return this.mongoClient.db();
  }
}
//
