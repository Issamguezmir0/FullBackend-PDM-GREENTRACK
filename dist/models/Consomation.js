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
class Consommation {
    constructor(type, valeur) {
        this.date = new Date().toISOString();
        this.type = type;
        this.valeur = valeur;
    }
    createTodo() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            yield db.collection("Consomation").insertOne(Object.assign({}, this));
            return this;
        });
    }
    calculateTotalForDay(startOfDay, endOfDay) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            const result = yield db
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
        });
    }
    calculateTotalByType(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            const result = yield db
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
        });
    }
    // Nouvelle méthode pour mettre à jour le total dans la base de données
    updateTotalInDatabase(total) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            yield db.collection("Consomation").updateOne({ type: this.type }, {
                $set: {
                    totalByType: total,
                },
            });
        });
    }
}
exports.default = Consommation;
