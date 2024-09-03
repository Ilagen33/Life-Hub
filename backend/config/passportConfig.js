import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET);

passport.use(
   
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/api/google/callback",
            scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile);
            try {
                let user = await User.findOne({googleId: profile.id})
                
                if(!user) {
                    user = new User( {
                        googleId: profile.id,
                        username: profile.displayName,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        email: profile.emails[0].value,
                        dataDiNascita: null,
                    });

                    await user.save();

                }

                done(null, user);

            } catch (error) {

                done(error, null)

            }
        }
    )
);

passport.serializeUser((user, done) => {

    done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
    try {

        const user = await User.findById(id);
        done(null, user);
        
    } catch(error) {

        done(error, null);
    }
});

export default passport;