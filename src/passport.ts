import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { SuperAdmin } from "@admin/model/superadmin.model";
import { Adminstration } from "@admin/model/adminstration";
import { config } from "@admin/config";

if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "Missing Google OAuth configuration. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env."
  );
}

function normalizeEmail(email?: string | null): string | null {
  return email?.trim().toLowerCase() ?? null;
}

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      // authenticate() in each route provides the role-specific callback URL.
      callbackURL: "/auth/admin/google/callback",
      passReqToCallback: true
    },
    async (req, _accessToken, _refreshToken, profile, done) => {
      try {
        const email = normalizeEmail(profile.emails?.[0]?.value);

        if (!email) {
          return done(null, false);
        }

        const superAdmin = await SuperAdmin.findOne({ email });

        if (superAdmin) {
          return done(null, {
            id: superAdmin._id,
            role: "SUPERADMIN",
            emails: profile.emails,
            displayName: profile.displayName,
            oauthState: req.query.state
          });
        }

        const admin = await Adminstration.findOne({ email });

        if (admin) {
          return done(null, {
            id: admin._id,
            role: "ADMIN",
            emails: profile.emails,
            displayName: profile.displayName,
            oauthState: req.query.state
          });
        }

        // If not found → deny login
        return done(null, {
          emails: profile.emails,
          displayName: profile.displayName,
          oauthState: req.query.state
        });

      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export {passport};
