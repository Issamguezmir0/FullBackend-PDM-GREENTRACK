import {Database} from "../database";
import {Db} from "mongodb";
import {ObjectId} from "mongodb";

class User {
    id?: string;
    fullname: string;
    adresse: string;
    email: string;
    cin: string;
    num_tel: string;
    password: string;
    img: string;
    age: string;
    isBanned: boolean;
    resetCode?: string;
    resetCodeExpiration?: Date;

    constructor(
        fullname: string,
        adresse: string,
        email: string,
        cin: string,
        num_tel: string,
        password: string,
        img: string,
        age: string,
        isBanned: boolean,
        id?: string,
        resetCode?: string,
        resetCodeExpiration?: Date,
    ) {
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
        this.resetCodeExpiration = resetCodeExpiration
    }

    static async getAll(): Promise<User[]> {
        try {
            const db: Db = Database.getDb();

            const users = await db.collection("users").find().toArray();

            return users.map((user) => new User(
                user.fullname,
                user.adresse || "",
                user.email || "",
                user.cin || "",
                user.num_tel || "",
                user.password,
                user.img || "",
                user.age || "",
                user.isBanned || false,
                user._id.toString(),
                user.resetCode,
                user.resetCodeExpiration
            ));
        } catch (error) {
            console.error("Error in getAllUsers:", error);
            throw error;
        }
    }

    static async getById(userId: string): Promise<User> {
        try {
            const db: Db = Database.getDb();
            const objectId = new ObjectId(userId);

            const user = await db.collection("users").findOne({_id: objectId});

            if (user) {
                return new User(
                    user.fullname,
                    user.adresse || "",
                    user.email || "",
                    user.cin || "",
                    user.num_tel || "",
                    user.password,
                    user.img || "",
                    user.age || "",
                    user.isBanned || false,
                    user._id.toString(),
                    user.resetCode,
                    user.resetCodeExpiration
                );
            } else {
                return User.empty;
            }
        } catch (error) {
            console.error("Error in getById:", error);
            throw error;
        }
    }

    static async update(idAlt: string, updatedUserData: any): Promise<void> {
        try {
            const { _id, ...updatedDataMinusId } = updatedUserData;

            const db: Db = Database.getDb();

            if (!idAlt) {
                idAlt = _id;
                throw new Error("User ID is not defined.");
            }

            const updateResult = await db.collection("users").updateOne(
                {_id: new ObjectId(idAlt)},
                {
                    $set: updatedDataMinusId
                }
            );

            // Update local object properties
            Object.assign(this, updatedUserData);
        } catch (error) {
            console.error("Error in update:", error);
            throw error;
        }
    }

    static async delete(id: string): Promise<void> {
        try {
            const db: Db = Database.getDb();

            if (!id) {
                throw new Error("User ID is not defined.");
            }

            const deleteResult = await db
                .collection("users")
                .deleteOne({_id: new ObjectId(id)});

            console.log(deleteResult)

            if (deleteResult.deletedCount !== 1) {
                throw new Error("Failed to delete the user.");
            }
        } catch (error) {
            console.error("Error in delete:", error);
            throw error;
        }
    }

    async createUser() {
        const db: Db = Database.getDb();
        delete this.id;
        const insertOneResult = await db.collection("users").insertOne({...this});
        return insertOneResult.insertedId.toString();
    }

    static isUserEmpty(user: User): boolean {
        return !user || !user.id;
    }

    async updateResetCode(newResetCode: string, newResetCodeExpiration: Date) {
        console.log("Updating reset code:");
        console.log("User ID:", this.id);
        console.log("newResetCode:", newResetCode);
        console.log("newResetCodeExpiration:", newResetCodeExpiration);

        const db: Db = Database.getDb();

        if (!this.id) {
            throw new Error("User ID is not defined.");
        }

        const updateResult = await db.collection("users").updateOne(
            {_id: new ObjectId(this.id)},
            {
                $set: {
                    resetCode: newResetCode,
                    resetCodeExpiration: newResetCodeExpiration,
                },
            }
        );

        if (updateResult.modifiedCount !== 1) {
            console.error("Failed to update reset code.");
            throw new Error("Failed to update reset code.");
        }

        this.resetCode = newResetCode;
        this.resetCodeExpiration = newResetCodeExpiration;

        console.log("Reset code updated successfully.");
    }

    isResetCodeValid(resetCode: string, resetCodeExpiration: Date): boolean {
        return (
            !!this.resetCode &&
            !!this.resetCodeExpiration &&
            this.resetCode === resetCode &&
            this.resetCodeExpiration >= resetCodeExpiration
        );
    }

    static empty = new User("", "", "", "", "", "", "", "", false, "");

    static async getUser(identifier: string): Promise<User> {
        try {
            const db: Db = Database.getDb();

            const isEmail = /\S+@\S+\.\S+/.test(identifier);
            const escapedIdentifier = identifier.replace(
                /[-\/\\^$*+?.()|[\]{}]/g,
                "\\$&"
            );
            const query = isEmail
                ? {email: new RegExp(`^${escapedIdentifier}$`, "i")}
                : {num_tel: new RegExp(`^${escapedIdentifier}$`, "i")};

            console.log("Query in getUser:", query);
            console.log("Identifier used in the query:", identifier);

            console.log(
                "Collection used in the query:",
                db.collection("users").collectionName
            );

            const document = await db.collection("users").findOne(query);

            console.log("Number of results found in the query:", document ? 1 : 0);

            console.log("User document from database:", document);

            if (document != null) {
                const user = new User(
                    document.fullname,
                    document.adresse || "",
                    document.email || "",
                    document.cin || "",
                    document.num_tel || "",
                    document.password,
                    document.img,
                    document.age,
                    document.isBanned || false,
                    document._id.toString(),
                    document.resetCode,
                    document.resetCodeExpiration
                );

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
            } else {
                return User.empty;
            }
        } catch (error) {
            console.error("Error in getUser:", error);
            throw error;
        }
    }

    static async getUserByNumTel(num_tel: string): Promise<User> {
        try {
            console.log("getUserByNumTel called with Num_tel:", num_tel);

            const db: Db = Database.getDb();

            const escapedNumTel = num_tel.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

            const query = {
                num_tel: num_tel.trim(),
            };
            const user = await db.collection("users").findOne(query);

            if (user) {
                console.log("User found:", user);
                return new User(
                    user.fullname,
                    user.adresse || "",
                    user.email || "",
                    user.cin || "",
                    user.num_tel || "",
                    user.password,
                    user.img || "",
                    user.age || "",
                    user.isBanned || false,
                    user._id.toString(),
                    user.resetCode,
                    user.resetCodeExpiration
                );
            } else {
                console.log("User not found.");
                return User.empty;
            }
        } catch (error) {
            console.error("Error in getUserByNumTel:", error);
            throw error;
        }
    }

    static async userExist(email: string): Promise<boolean> {
        try {
            const db: Db = Database.getDb();

            const user = await db.collection("users").findOne({email});

            return !!user;
        } catch (error) {
            console.error("Error in getUserByNumTel:", error);
            throw error;
        }
    }

    static async getUserById(userId: string) {
        const db: Db = Database.getDb();

        console.log(userId)
        console.log(new ObjectId(userId))

        try {
            const objectId = new ObjectId(userId);
            const user = await db.collection("users").findOne({_id: objectId});

            if (user != null) {
                return new User(
                    user.fullname,
                    user.adresse,
                    user.email,
                    user.cin,
                    user.num_tel,
                    user.password,
                    user.img,
                    user.age,
                    user.isBanned || false,
                    user._id.toString()
                );
            } else {
                return User.empty;
            }
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            throw error;
        }
    }

    async updatePassword(newPassword: string) {
        const db: Db = Database.getDb();

        if (!this.id) {
            throw new Error("User ID is not defined.");
        }

        const updateResult = await db
            .collection("users")
            .updateOne(
                {_id: new ObjectId(this.id)},
                {$set: {password: newPassword}}
            );

        if (updateResult.modifiedCount !== 1) {
            throw new Error("Failed to update password.");
        }
    }

    async updateProfile() {
        const db = Database.getDb();

        if (!this.id) {
            throw new Error("User ID is not defined.");
        }

        const updateResult = await db.collection("users").updateOne(
            {_id: new ObjectId(this.id)},
            {
                $set: {
                    fullname: this.fullname,
                    adresse: this.adresse,
                    email: this.email,
                    cin: this.cin,
                    num_tel: this.num_tel,
                    img: this.img,
                    age: this.age,
                },
            }
        );

        if (updateResult.modifiedCount !== 1) {
            throw new Error("Failed to update user profile.");
        }
    }

    async updateProfileImage() {
        try {
            const db = Database.getDb();

            if (!this.id) {
                throw new Error("L'ID de l'utilisateur n'est pas défini.");
            }

            const updateResult = await db
                .collection("users")
                .updateOne({_id: new ObjectId(this.id)}, {$set: {img: this.img}});

            if (updateResult.modifiedCount !== 1) {
                throw new Error("Échec de la mise à jour de l'image de profil.");
            }
        } catch (error) {
            console.error(
                "Erreur lors de la mise à jour de l'image de profil dans le modèle User:",
                error
            );
            throw error; // Relance l'erreur pour qu'elle soit capturée par le contrôleur
        }
    }

    async deleteUser() {
        const db = Database.getDb();

        if (!this.id) {
            throw new Error("L'ID de l'utilisateur n'est pas défini.");
        }

        const deleteResult = await db
            .collection("users")
            .deleteOne({_id: new ObjectId(this.id)});

        if (deleteResult.deletedCount !== 1) {
            throw new Error("Échec de la suppression de l'utilisateur.");
        }
    }
}

export default User;
