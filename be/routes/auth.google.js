import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      
      clientID: "5851472794205-oct1jdnsjfr846ffcdvsfrgu2nhfjp2obn3b.apps.googleusercontent.com",
      clientSecret: "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zubR",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

router.get("/login", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "/google/profile",
    failureRedirect: "/",
  })
);

export default router;
