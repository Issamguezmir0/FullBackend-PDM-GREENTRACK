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
class Home {
    constructor(idUser, DescriptionArticle, image, comments = [], likes, id) {
        this.comments = [];
        this.likes = 0;
        this.id = id;
        this.idUser = idUser;
        this.DescriptionArticle = DescriptionArticle;
        this.image = image;
        this.comments = comments;
        this.likes = likes;
    }
    createHome() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            delete this.id;
            yield db.collection("article").insertOne(Object.assign({}, this));
            const homes = yield Home.getHomes();
            return homes;
        });
    }
    static getHomes() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            const documents = yield db.collection("article").find().toArray();
            const homes = documents.map((doc) => new Home(doc.idUser, doc.DescriptionArticle, doc.image, doc.comments || [], doc.likes, // Explicitly define the type as string[
            doc._id.toString()));
            return homes;
        });
    }
    updateHome() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            yield db.collection("article").updateOne({ _id: new mongodb_1.ObjectId(this.id) }, {
                $set: {
                    idUser: this.idUser,
                    DescriptionArticle: this.DescriptionArticle,
                    image: this.image,
                    comments: this.comments,
                    likes: this.likes,
                },
            } //CHANGE
            );
            const homes = yield Home.getHomes();
            return homes;
        });
    }
    addLike() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = database_1.Database.getDb();
                console.log("Updating likes for video with ID:", this.id);
                yield db
                    .collection("article")
                    .updateOne({ _id: new mongodb_1.ObjectId(this.id) }, { $inc: { likes: 1 } });
                const homes = yield Home.getHomes();
                console.log("Successfully updated likes. Updated videos:", homes);
                return homes;
            }
            catch (error) {
                console.error("Failed to update likes:", error);
                throw error;
            }
        });
    }
    static deleteHome(homeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            yield db.collection("article").deleteOne({ _id: new mongodb_1.ObjectId(homeId) });
            const homes = yield Home.getHomes();
            return homes;
        });
    }
    addComment(comments, homeId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Comment:", comments);
            console.log("Home ID:", homeId);
            if (comments !== null && comments !== undefined) {
                const db = database_1.Database.getDb();
                yield db
                    .collection("article")
                    .updateOne({ _id: new mongodb_1.ObjectId(homeId) }, { $push: { comments: comments } });
            }
            const homes = yield Home.getHomes();
            return homes;
        });
    }
    // home.ts
    static getComments(homeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            const document = yield db
                .collection("article")
                .findOne({ _id: new mongodb_1.ObjectId(homeId) });
            if (!document) {
                throw new Error("Home not found");
            }
            const home = new Home(document.idUser, document.DescriptionArticle, document.image, document.comments || [], document.likes, document._id.toString());
            return home;
        });
    }
}
exports.default = Home;
