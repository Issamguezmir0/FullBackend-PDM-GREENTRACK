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
class Eco_point {
    constructor(nbrPoint, description, favoris, localisation, id) {
        this.id = id;
        this.nbrPoint = nbrPoint;
        this.description = description;
        this.favoris = favoris;
        this.localisation = localisation;
    }
    createEco_point() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            delete this.id;
            yield db.collection("eco_points").insertOne(Object.assign({}, this));
            const eco_points = yield Eco_point.getEco_points();
            return eco_points;
        });
    }
    static getEco_points() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            const documents = yield db.collection("eco_points").find().toArray();
            const eco_points = documents.map((doc) => new Eco_point(doc.nbrPoint, doc.description, doc.favoris, doc.localisation, doc._id.toString()));
            return eco_points;
        });
    }
    updateEco_point() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            yield db.collection("eco_points").updateOne({ _id: new mongodb_1.ObjectId(this.id) }, {
                $set: {
                    nbrPoint: this.nbrPoint,
                    description: this.description,
                    favoris: this.favoris,
                    localisationt: this.localisation,
                },
            });
            const eco_points = yield Eco_point.getEco_points();
            return eco_points;
        });
    }
    static deleteEco_point(eco_pointId) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            yield db
                .collection("eco_points")
                .deleteOne({ _id: new mongodb_1.ObjectId(eco_pointId) });
            const todos = yield Eco_point.getEco_points();
            return todos;
        });
    }
}
exports.default = Eco_point;
