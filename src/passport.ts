import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { SuperAdmin } from "@admin/model/superadmin.model";
import { Adminstration } from "@admin/model/adminstration";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;

        //Check SuperAdmin
        let superAdmin = await SuperAdmin.findOne({ email });

        if (superAdmin) {
          return done(null, {
            id: superAdmin._id,
            role: "SUPERADMIN"
          });
        }

        //Check Admin
        let admin = await Adminstration.findOne({ email });

        if (admin) {
          return done(null, {
            id: admin._id,
            role: "ADMIN"
          });
        }

        // If not found → deny login
        return done(null, false);

      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export {passport};