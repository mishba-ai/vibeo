import passport, { use } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { prisma } from './index';
import jwt from 'jsonwebtoken'

const jwtSecret = process.env.JWT_SECRET;


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
  async (_accessToken, _refreshToken, profile, cb) => {
    try {
      const user = await prisma.$transaction(async (tx) => {
        let existingUser = await tx.user.findUnique({
          where: { googleId: profile.id }
        });
        if (!existingUser) {
          existingUser = await tx.user.create({
            data: {
              email: profile.emails?.[0]?.value!,
              username: profile.displayName,
              googleId: profile.id,
              avatar: profile.photos?.[0]?.value
            }
          })
        }
        return existingUser;

      })
      const token = jwt.sign({
        id: user.id,
        username: user.username,
        avatar: user.avatar
      }, jwtSecret!, {
        expiresIn: "24h"
      })
      return cb(null, { user, token })
    } catch (error) {
      cb(error)
    }
  }
));

export {
  passport
}