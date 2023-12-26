import { Request, Response } from "express";
import User from "../models/user"; 

const editProfile = {
  editProfile: async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const { fullname, adresse, email, cin, num_tel, img } = req.body;

      const user = await User.getUserById(userId);

      user.fullname = fullname || user.fullname;
      user.adresse = adresse || user.adresse;
      user.email = email || user.email;
      user.cin = cin || user.cin;
      user.num_tel = num_tel || user.num_tel;
      user.img = img || user.img;

      await user.updateProfile();

      res
        .status(200)
        .json({ success: true, message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error in edit profile:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
  getProfile: async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;

      const user = await User.getUserById(userId);

      if (user !== User.empty) {
        res.status(200).json({
          success: true,
          message: "Profile data retrieved successfully",
          profile: {
            id: user.id,
            fullname: user.fullname,
            adresse: user.adresse,
            email: user.email,
            cin: user.cin,
            num_tel: user.num_tel,
            img: user.img,
            age: user.age
          },
        });
      } else {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    } catch (error) {
      console.error("Error in get profile:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
  updateProfileImage: async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId.trim(); 

      console.log("UserID:", userId);

      if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
        console.log("Invalid UserID:", userId);
        return res.status(400).json({
          success: false,
          message: "ID d'utilisateur invalide",
        });
      }

      const user = await User.getUserById(userId);

      if (user !== User.empty) {
        if (!req.file) {
          return res.status(400).json({
            success: false,
            message: "Veuillez télécharger une image de profil valide.",
          });
        }

        user.img = req.file.buffer.toString("base64");

        try {
          await user.updateProfileImage();
        } catch (updateError) {
          console.error(
            "Erreur lors de la mise à jour de l'image de profil:",
            updateError
          );
          console.error((updateError as Error).stack);
          return res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour de l'image de profil",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Image de profil mise à jour avec succès",
          profile: {
            id: user.id,
            fullname: user.fullname,
            adresse: user.adresse,
            email: user.email,
            cin: user.cin,
            num_tel: user.num_tel,
            img: user.img,
            age: user.age
          },
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé",
        });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de l'image de profil:",
        error
      );

      console.error((error as Error).stack);

      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
      });
    }
  },
};

export default editProfile;
