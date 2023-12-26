import { Database } from "../database";
import { Db } from "mongodb";

class Consommation {
  date: string;
  type: string;
  valeur: number;

  constructor(type: string, valeur: number) {
    this.date = new Date().toISOString();
    this.type = type;
    this.valeur = valeur;
  }

  async createTodo() {
    const db: Db = Database.getDb();
    await db.collection("Consomation").insertOne({ ...this });
    return this;
  }

  async calculateTotalForDay(
    startOfDay: Date,
    endOfDay: Date
  ): Promise<number> {
    const db: Db = Database.getDb();

    const result = await db
      .collection("Consomation")
      .aggregate([
        {
          $match: {
            date: {
              $gte: startOfDay.toISOString(),
              $lt: endOfDay.toISOString(),
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$valeur" },
          },
        },
      ])
      .toArray();

    return result.length > 0 ? result[0].total : 0;
  }

  async calculateTotalByType(type: string): Promise<number> {
    const db: Db = Database.getDb();

    const result = await db
      .collection("Consomation")
      .aggregate([
        {
          $match: {
            type: type,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$valeur" },
          },
        },
      ])
      .toArray();

    return result.length > 0 ? result[0].total : 0;
  }

  // Nouvelle méthode pour mettre à jour le total dans la base de données
  async updateTotalInDatabase(total: number): Promise<void> {
    const db: Db = Database.getDb();

    await db.collection("Consomation").updateOne(
      { type: this.type },
      {
        $set: {
          totalByType: total,
        },
      }
    );
  }
}

export default Consommation;
