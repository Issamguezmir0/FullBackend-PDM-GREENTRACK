import passport from 'passport';
import { Request, Response } from 'express';

const authController = {
  googleLogin: passport.authenticate('google', { scope: ['profile', 'email'] }),

  googleCallback: passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/',
  }),

  profile: (req: Request, res: Response) => {
    try {
      if (req.isAuthenticated()) {
        res.status(200).json({
          success: true,
          message: 'Utilisateur authentifié avec succès',
          profile: req.user,
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'L\'utilisateur n\'est pas authentifié',
        });
      }
    } catch (error) {
      console.error('Erreur dans le contrôleur de profil:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur',
      });
    }
  },
};

export default authController;
