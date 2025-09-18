import { prisma } from "@/config";
import { protect } from "@/middlewares/auth.middleware";
import { response, Router } from "express";
import type { Router as ExpressRouter } from 'express'
import passport from "passport";
const authRouter: ExpressRouter = Router()
import axios from 'axios'

authRouter.get('/google',
  passport.authenticate('google', { scope: ['profile', "email"] }));

authRouter.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: 'http://localhost:5173'
  }),
  (req, res) => {
    // Successful authentication, redirect home.

    const { token } = req.user as any;
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "lax",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
    res.redirect('http://localhost:5173/feed');
  });

authRouter.get("/failure", (req, res) => {
  res.status(401).json({ message: "google auth failed" });
})

authRouter.post('/logout', (req, res) => {
  res.clearCookie('jwt')
  res.status(200).json({ message: 'logged out successfully' })
})

authRouter.get('/feed', protect, (req, res) => {
  console.log('User data from Passport:', req.user); 

  res.status(200).json({
    message: "User is authenticated",
    user: req.user
  });
})

authRouter.get('/avatar/:userId', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId }
    })

    if (!user || !user.avatar) {
      return res.status(404).json({
        message: "avatar not found"
      })
    }

    const response = await axios.get(user.avatar, { responseType: 'arraybuffer' })

    //set the  headers for the image
    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('Content-Length', response.headers['content-length']);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); 

    res.status(200).send(response.data);
  } catch (error) {
   console.error('Error proxying avatar:', error);
    res.status(500).json({ message: "Could not retrieve avatar" });
  }
})

export {
  authRouter
}