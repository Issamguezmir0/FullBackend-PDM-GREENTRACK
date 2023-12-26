import { deleteHome } from "../controller/home-controller";
import { Database } from "../database";
import { ObjectId, Db } from "mongodb";

class Home {
  id?: string;
  idUser?: string;
  DescriptionArticle?: string;
  image?: string; //CHANGE
  comments: string[] = [];
  likes: number = 0;

  constructor(
    idUser: string,
    DescriptionArticle: string,
    image: string,
    comments: string[] = [],
    likes: number,
    id?: string
  ) {
    this.id = id;
    this.idUser = idUser;
    this.DescriptionArticle = DescriptionArticle;
    this.image = image;
    this.comments = comments;
    this.likes = likes;
  }

  async createHome() {
    const db: Db = Database.getDb();
    delete this.id;
    await db.collection("article").insertOne({ ...this });
    const homes = await Home.getHomes();
    return homes;
  }

  static async getHomes() {
    const db: Db = Database.getDb();
    const documents = await db.collection("article").find().toArray();

    const homes: Home[] = documents.map(
      (doc) =>
        new Home(
          doc.idUser,
          doc.DescriptionArticle,
          doc.image,
          (doc.comments as string[]) || [],
          doc.likes, // Explicitly define the type as string[
          doc._id.toString()
        )
    );

    return homes;
  }

  async updateHome() {
    const db: Db = Database.getDb();
    await db.collection("article").updateOne(
      { _id: new ObjectId(this.id) },
      {
        $set: {
          idUser: this.idUser,
          DescriptionArticle: this.DescriptionArticle,
          image: this.image,
          comments: this.comments,
          likes: this.likes,
        },
      } //CHANGE
    );

    const homes = await Home.getHomes();
    return homes;
  }
  async addLike() {
    try {
      const db: Db = Database.getDb();

      console.log("Updating likes for video with ID:", this.id);

      await db
        .collection("article")
        .updateOne({ _id: new ObjectId(this.id) }, { $inc: { likes: 1 } });

      const homes = await Home.getHomes();
      console.log("Successfully updated likes. Updated videos:", homes);

      return homes;
    } catch (error) {
      console.error("Failed to update likes:", error);
      throw error;
    }
  }
  static async deleteHome(homeId: string) {
    const db: Db = Database.getDb();
    await db.collection("article").deleteOne({ _id: new ObjectId(homeId) });

    const homes = await Home.getHomes();
    return homes;
  }
  async addComment(comments: string | null, homeId: string) {
    console.log("Comment:", comments);
    console.log("Home ID:", homeId);

    if (comments !== null && comments !== undefined) {
      const db: Db = Database.getDb();
      await db
        .collection("article")
        .updateOne(
          { _id: new ObjectId(homeId) },
          { $push: { comments: comments } }
        );
    }

    const homes = await Home.getHomes();
    return homes;
  }

  // home.ts

  static async getComments(homeId: string) {
    const db: Db = Database.getDb();
    const document = await db
      .collection("article")
      .findOne({ _id: new ObjectId(homeId) });

    if (!document) {
      throw new Error("Home not found");
    }

    const home: Home = new Home(
      document.idUser,
      document.DescriptionArticle,
      document.image,
      (document.comments as string[]) || [],
      document.likes,
      document._id.toString()
    );

    return home;
  }
}

export default Home;
