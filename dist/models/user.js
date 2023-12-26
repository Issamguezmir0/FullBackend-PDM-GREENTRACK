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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const mongodb_1 = require("mongodb");
class User {
    constructor(fullname, adresse, email, cin, num_tel, password, img, age, isBanned, id, resetCode, resetCodeExpiration) {
        this.id = id;
        this.fullname = fullname;
        this.adresse = adresse;
        this.email = email;
        this.cin = cin;
        this.num_tel = num_tel;
        this.password = password;
        this.img = img;
        this.age = age;
        this.isBanned = isBanned;
        this.resetCode = resetCode;
        this.resetCodeExpiration = resetCodeExpiration;
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = database_1.Database.getDb();
                const users = yield db.collection("users").find().toArray();
                return users.map((user) => new User(user.fullname, user.adresse || "", user.email || "", user.cin || "", user.num_tel || "", user.password, user.img || "", user.age || "", user.isBanned || false, user._id.toString(), user.resetCode, user.resetCodeExpiration));
            }
            catch (error) {
                console.error("Error in getAllUsers:", error);
                throw error;
            }
        });
    }
    static getById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = database_1.Database.getDb();
                const objectId = new mongodb_1.ObjectId(userId);
                const user = yield db.collection("users").findOne({ _id: objectId });
                if (user) {
                    return new User(user.fullname, user.adresse || "", user.email || "", user.cin || "", user.num_tel || "", user.password, user.img || "", user.age || "", user.isBanned || false, user._id.toString(), user.resetCode, user.resetCodeExpiration);
                }
                else {
                    return User.empty;
                }
            }
            catch (error) {
                console.error("Error in getById:", error);
                throw error;
            }
        });
    }
    static update(idAlt, updatedUserData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = updatedUserData, updatedDataMinusId = __rest(updatedUserData, ["_id"]);
                const db = database_1.Database.getDb();
                if (!idAlt) {
                    idAlt = _id;
                    throw new Error("User ID is not defined.");
                }
                const updateResult = yield db.collection("users").updateOne({ _id: new mongodb_1.ObjectId(idAlt) }, {
                    $set: updatedDataMinusId
                });
                // Update local object properties
                Object.assign(this, updatedUserData);
            }
            catch (error) {
                console.error("Error in update:", error);
                throw error;
            }
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = database_1.Database.getDb();
                if (!id) {
                    throw new Error("User ID is not defined.");
                }
                const deleteResult = yield db
                    .collection("users")
                    .deleteOne({ _id: new mongodb_1.ObjectId(id) });
                console.log(deleteResult);
                if (deleteResult.deletedCount !== 1) {
                    throw new Error("Failed to delete the user.");
                }
            }
            catch (error) {
                console.error("Error in delete:", error);
                throw error;
            }
        });
    }
    createUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            delete this.id;
            const insertOneResult = yield db.collection("users").insertOne(Object.assign({}, this));
            return insertOneResult.insertedId.toString();
        });
    }
    static isUserEmpty(user) {
        return !user || !user.id;
    }
    updateResetCode(newResetCode, newResetCodeExpiration) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Updating reset code:");
            console.log("User ID:", this.id);
            console.log("newResetCode:", newResetCode);
            console.log("newResetCodeExpiration:", newResetCodeExpiration);
            const db = database_1.Database.getDb();
            if (!this.id) {
                throw new Error("User ID is not defined.");
            }
            const updateResult = yield db.collection("users").updateOne({ _id: new mongodb_1.ObjectId(this.id) }, {
                $set: {
                    resetCode: newResetCode,
                    resetCodeExpiration: newResetCodeExpiration,
                },
            });
            if (updateResult.modifiedCount !== 1) {
                console.error("Failed to update reset code.");
                throw new Error("Failed to update reset code.");
            }
            this.resetCode = newResetCode;
            this.resetCodeExpiration = newResetCodeExpiration;
            console.log("Reset code updated successfully.");
        });
    }
    isResetCodeValid(resetCode, resetCodeExpiration) {
        return (!!this.resetCode &&
            !!this.resetCodeExpiration &&
            this.resetCode === resetCode &&
            this.resetCodeExpiration >= resetCodeExpiration);
    }
    static getUser(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = database_1.Database.getDb();
                const isEmail = /\S+@\S+\.\S+/.test(identifier);
                const escapedIdentifier = identifier.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
                const query = isEmail
                    ? { email: new RegExp(`^${escapedIdentifier}$`, "i") }
                    : { num_tel: new RegExp(`^${escapedIdentifier}$`, "i") };
                console.log("Query in getUser:", query);
                console.log("Identifier used in the query:", identifier);
                console.log("Collection used in the query:", db.collection("users").collectionName);
                const document = yield db.collection("users").findOne(query);
                console.log("Number of results found in the query:", document ? 1 : 0);
                console.log("User document from database:", document);
                if (document != null) {
                    const user = new User(document.fullname, document.adresse || "", document.email || "", document.cin || "", document.num_tel || "", document.password, document.img, document.age, document.isBanned || false, document._id.toString(), document.resetCode, document.resetCodeExpiration);
                    console.log("User object created:", user);
                    console.log("User ID:", user.id);
                    console.log("User Fullname:", user.fullname);
                    console.log("User Adresse:", user.adresse);
                    console.log("User Email:", user.email);
                    console.log("User Cin:", user.cin);
                    console.log("User image:", user.img);
                    console.log("User age:", user.age);
                    console.log("User Num_tel:", user.num_tel);
                    return user;
                }
                else {
                    return User.empty;
                }
            }
            catch (error) {
                console.error("Error in getUser:", error);
                throw error;
            }
        });
    }
    static getUserByNumTel(num_tel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("getUserByNumTel called with Num_tel:", num_tel);
                const db = database_1.Database.getDb();
                const escapedNumTel = num_tel.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
                const query = {
                    num_tel: num_tel.trim(),
                };
                const user = yield db.collection("users").findOne(query);
                if (user) {
                    console.log("User found:", user);
                    return new User(user.fullname, user.adresse || "", user.email || "", user.cin || "", user.num_tel || "", user.password, user.img || "", user.age || "", user.isBanned || false, user._id.toString(), user.resetCode, user.resetCodeExpiration);
                }
                else {
                    console.log("User not found.");
                    return User.empty;
                }
            }
            catch (error) {
                console.error("Error in getUserByNumTel:", error);
                throw error;
            }
        });
    }
    static userExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = database_1.Database.getDb();
                const user = yield db.collection("users").findOne({ email });
                return !!user;
            }
            catch (error) {
                console.error("Error in getUserByNumTel:", error);
                throw error;
            }
        });
    }
    static getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            console.log(userId);
            console.log(new mongodb_1.ObjectId(userId));
            try {
                const objectId = new mongodb_1.ObjectId(userId);
                const user = yield db.collection("users").findOne({ _id: objectId });
                if (user != null) {
                    return new User(user.fullname, user.adresse, user.email, user.cin, user.num_tel, user.password, user.img, user.age, user.isBanned || false, user._id.toString());
                }
                else {
                    return User.empty;
                }
            }
            catch (error) {
                console.error("Error fetching user by ID:", error);
                throw error;
            }
        });
    }
    updatePassword(newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            if (!this.id) {
                throw new Error("User ID is not defined.");
            }
            const updateResult = yield db
                .collection("users")
                .updateOne({ _id: new mongodb_1.ObjectId(this.id) }, { $set: { password: newPassword } });
            if (updateResult.modifiedCount !== 1) {
                throw new Error("Failed to update password.");
            }
        });
    }
    updateProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            if (!this.id) {
                throw new Error("User ID is not defined.");
            }
            const updateResult = yield db.collection("users").updateOne({ _id: new mongodb_1.ObjectId(this.id) }, {
                $set: {
                    fullname: this.fullname,
                    adresse: this.adresse,
                    email: this.email,
                    cin: this.cin,
                    num_tel: this.num_tel,
                    img: this.img,
                    age: this.age,
                },
            });
            if (updateResult.modifiedCount !== 1) {
                throw new Error("Failed to update user profile.");
            }
        });
    }
    updateProfileImage() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = database_1.Database.getDb();
                if (!this.id) {
                    throw new Error("L'ID de l'utilisateur n'est pas défini.");
                }
                const updateResult = yield db
                    .collection("users")
                    .updateOne({ _id: new mongodb_1.ObjectId(this.id) }, { $set: { img: this.img } });
                if (updateResult.modifiedCount !== 1) {
                    throw new Error("Échec de la mise à jour de l'image de profil.");
                }
            }
            catch (error) {
                console.error("Erreur lors de la mise à jour de l'image de profil dans le modèle User:", error);
                throw error; // Relance l'erreur pour qu'elle soit capturée par le contrôleur
            }
        });
    }
    deleteUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = database_1.Database.getDb();
            if (!this.id) {
                throw new Error("L'ID de l'utilisateur n'est pas défini.");
            }
            const deleteResult = yield db
                .collection("users")
                .deleteOne({ _id: new mongodb_1.ObjectId(this.id) });
            if (deleteResult.deletedCount !== 1) {
                throw new Error("Échec de la suppression de l'utilisateur.");
            }
        });
    }
}
User.empty = new User("", "", "", "", "", "", "", "", false, "");
exports.default = User;
