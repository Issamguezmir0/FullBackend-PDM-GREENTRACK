import { deleteChallenge } from "../controller/challengeController";
import { Database } from "../database";
import { ObjectId, Db } from "mongodb";

class Challenge {
  id?: string;
  image: string;
  title: String;
  description: String;
  date: Date; 
  location: String; 
  isFree: boolean; 
  participants: String[];
  organisateurs: String[]; 
  details: String; 
  price : String;

  constructor(
    image: string,
    title: String,
    description: String,
    date: Date,
    location: String,
    isFree: boolean,
    participants: String[],
    organisateurs: String[],
    details: String,
    price: string,
    id?: string
    
  ) {
    this.id = id;
    this.image = image;
    
    this.title = title;
    this.description = description;
    this.date = date;
    this.location = location;
    this.isFree = isFree;
    this.participants = participants;
    this.organisateurs = organisateurs;
    this.details = details;
    this.price = price ;
  }

  async createChallenge() {
    const db: Db = Database.getDb();
    delete this.id;
    await db.collection("event").insertOne({ ...this });
    const event = await Challenge.getChallenge();
    return event;
  }

  // static async getChallenge() {
  //   const db: Db = Database.getDb();
  //   const documents = await db.collection("event").find().toArray();

  //   const event: Challenge[] = documents.map(
  //     (doc) =>
  //       new Challenge(
  //         doc.image, 
  //         doc.title,
  //         doc.description,
  //         doc.date,
  //         doc.location,
  //         doc.isFree,
  //         doc.participants,
  //         doc.organisateurs,
  //         doc.details,
  //         doc._id.toString()
  //       )
  //   );
  //   return event;
  // }
  static async getChallenge() {
    const db: Db = Database.getDb();
    const documents = await db.collection("event").find().toArray();
  
    const event: Challenge[] = documents.map((doc) => {
      const participants = Array.isArray(doc.participants) ? doc.participants : [];
      const organisers = Array.isArray(doc.organisateurs) ? doc.organisateurs : [];
  
      return new Challenge(
        doc.image, 
        doc.title,
        doc.description,
        doc.date,
        doc.location,
        doc.isFree,
        participants, 
        organisers,
        doc.details,
        doc.price,
        doc._id.toString(),
      );
    });
    return event;
  }
  


  async updateChallenge() {
    const db: Db = Database.getDb();
    await db.collection("event").updateOne(
      { _id: new ObjectId(this.id) },
      {
        $set: {
          image: this.image,
          title: this.title,
          description: this.description,
          date: this.date,
          location: this.location,
          isFree: this.isFree,
          participants: this.participants,
          organisateurs: this.organisateurs,
          details: this.details,
          price: this.price,
        },
      }
    );

    const event = await Challenge.getChallenge();
    return event;
  }

  static async deleteChallenge(id: string) {
    const db: Db = Database.getDb();
    await db.collection("event").deleteOne({ _id: new ObjectId(id) });

    const event = await Challenge.getChallenge();
    return event;
  }
}

export default Challenge;
