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
exports.Database = void 0;
const mongodb_1 = require("mongodb");
class Database {
    constructor() { }
    static initilize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.mongoClient = yield mongodb_1.MongoClient.connect("mongodb+srv://guezmirissam:98986476@cluster0.krkpf7f.mongodb.net/?retryWrites=true&w=majority");
        });
    }
    static getDb() {
        return this.mongoClient.db();
    }
}
exports.Database = Database;
//
