import { Request, Response } from "express";
import User from "../models/user";

class UserController {
  static async deleteUser(req: Request, res: Response) {
    const userId = req.params.userId;

    try {
      const user = await User.getUserById(userId);

      if (User.isUserEmpty(user)) {
        res.status(404).json({ message: "Utilisateur non trouvé" });
      } else {
        await user.deleteUser();
        res.json({ message: "Utilisateur supprimé avec succès" });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression de l'utilisateur" });
    }
  }
}

export default UserController;
