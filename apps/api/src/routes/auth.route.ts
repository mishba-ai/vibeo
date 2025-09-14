import { Router } from "express";
import type { Router as ExpressRouter } from 'express'
import passport from "passport";
const authRouter: ExpressRouter = Router()


authRouter.get('/google',
  passport.authenticate('google', { scope: ['profile', "email"] }));

authRouter.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login'
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    const { token } = req.user as any;
    res.json({ success: true, token });
  });

authRouter.get("/failure", (req, res) => {
  res.status(401).json({ message: "google auth failed" });
})

export {
  authRouter
}