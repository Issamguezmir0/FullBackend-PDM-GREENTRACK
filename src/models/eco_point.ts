import { Database } from "../database";
import { ObjectId, Db } from "mongodb";

class Eco_point {
  id?: string;
  nbrPoint: string;
  description: String;
  favoris: String;
  localisation: String;

  constructor(
    nbrPoint: string,
    description: string,
    favoris: String,
    localisation: String,
    id?: string
  ) {
    this.id = id;
    this.nbrPoint = nbrPoint;
    this.description = description;
    this.favoris = favoris;
    this.localisation = localisation;
  }

  async createEco_point() {
    const db: Db = Database.getDb();
    delete this.id;
    await db.collection("eco_points").insertOne({ ...this });
    const eco_points = await Eco_point.getEco_points();
    return eco_points;
  }

  static async getEco_points() {
    const db: Db = Database.getDb();
    const documents = await db.collection("eco_points").find().toArray();

    const eco_points: Eco_point[] = documents.map(
      (doc) =>
        new Eco_point(
          doc.nbrPoint,
          doc.description,
          doc.favoris,
          doc.localisation,
          doc._id.toString()
        )
    );
    return eco_points;
  }

  async updateEco_point() {
    const db: Db = Database.getDb();
    await db.collection("eco_points").updateOne(
      { _id: new ObjectId(this.id) },
      {
        $set: {
          nbrPoint: this.nbrPoint,
          description: this.description,
          favoris: this.favoris,
          localisationt: this.localisation,
        },
      }
    );

    const eco_points = await Eco_point.getEco_points();
    return eco_points;
  }

  static async deleteEco_point(eco_pointId: string) {
    const db: Db = Database.getDb();
    await db
      .collection("eco_points")
      .deleteOne({ _id: new ObjectId(eco_pointId) });

    const todos = await Eco_point.getEco_points();
    return todos;
  }
}

export default Eco_point;
