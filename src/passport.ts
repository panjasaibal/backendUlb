import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "@admin/config";

if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "Missing Google OAuth configuration. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env."
  );
}

function normalizeEmail(email?: string | null): string | null {
  return email?.trim().toLowerCase() ?? null;
}

interface OAuthGoogleProfile {
  emails: Array<{ value: string }>;
  displayName?: string;
}

const buildOAuthProfile = (
  email: string,
  displayName: string | undefined
): OAuthGoogleProfile => ({
  emails: [{ value: email }],
  displayName
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      // Each auth route overrides this with its role-specific callback URL.
      callbackURL: "/auth/google/callback",
      passReqToCallback: true
    },
    async (req, _accessToken, _refreshToken, profile, done) => {
      try {
        const email = normalizeEmail(profile.emails?.[0]?.value);

        if (!email) {
          return done(null, false);
        }

        return done(
          null,
          buildOAuthProfile(email, profile.displayName)
        );
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export {passport};
