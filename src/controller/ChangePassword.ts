// controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";

export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    console.log('Received request to change password. User ID:', userId);
//jib data
    const user = await User.getUserById(userId);

    console.log('User from database:', user);

    if (user === User.empty) {
      console.log('User not found.');
      res.status(404).json({ message: "Utilisateur non trouvé." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    console.log('Is password valid:', isPasswordValid);

    if (isPasswordValid) {
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      await user.updatePassword(newHashedPassword);

      console.log('Password updated successfully.');
      res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
    } else {
      console.log('Incorrect current password.');
      res.status(401).json({ message: "Mot de passe actuel incorrect." });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};
