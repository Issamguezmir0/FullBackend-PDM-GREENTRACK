

/*import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Request, Response } from 'express';
import User from '../models/user'; // Ensure that the path is correct

// Configure Google OAuth 2.0 strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: 'your_client_id',
      clientSecret: 'your_client_secret',
      callbackURL: 'http://localhost:3000/auth/google/callback', // Update with your callback URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user exists in the database
        let user = await User.getUserById(profile.id);

        if (!user || user === User.empty) {
          // If the user doesn't exist, create them in the database
          user = new User(
            profile.displayName || '',
            '', // Other profile fields can be added here
            profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '',
            profile.id,
            '',
            '', // Add other profile fields as needed
            '' // Field for profile image
          );

          const userId = await user.createUser();
          user.id = userId;
        }

        return done(null, user);
      } catch (error) {
        console.error('Error in Google OAuth strategy:', error);
        return done(error, null);
      }
    }
  )
);

// Serialize user into the session
passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.getUserById(id);
    done(null, user);
  } catch (error) {
    console.error('Error during user deserialization:', error);
    done(error, null);
  }
});

export default passport;*/
