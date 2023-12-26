"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const mongodb_1 = require("mongodb");
class Challenge {
    constructor(image, title, description, date, location, isFree, participants, organisateurs, details, price, id) {
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
        this.price = price;
    }
    createChallenge() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            delete this.id;
            yield db.collection("event").insertOne(Object.assign({}, this));
            const event = yield Challenge.getChallenge();
            return event;
        });
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
    static getChallenge() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            const documents = yield db.collection("event").find().toArray();
            const event = documents.map((doc) => {
                const participants = Array.isArray(doc.participants) ? doc.participants : [];
                const organisers = Array.isArray(doc.organisateurs) ? doc.organisateurs : [];
                return new Challenge(doc.image, doc.title, doc.description, doc.date, doc.location, doc.isFree, participants, organisers, doc.details, doc.price, doc._id.toString());
            });
            return event;
        });
    }
    updateChallenge() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            yield db.collection("event").updateOne({ _id: new mongodb_1.ObjectId(this.id) }, {
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
            });
            const event = yield Challenge.getChallenge();
            return event;
        });
    }
    static deleteChallenge(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            yield db.collection("event").deleteOne({ _id: new mongodb_1.ObjectId(id) });
            const event = yield Challenge.getChallenge();
            return event;
        });
    }
}
exports.default = Challenge;
