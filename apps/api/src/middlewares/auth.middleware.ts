import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const jwtSecret = process.env.JWT_SECRET

export const protect = (req: Request, res: Response, next: NextFunction) => {

    //get jwt from cookie
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({
            message: 'auth failed'
        })
    }
    try {
        const verify = jwt.verify(token, jwtSecret!);
        (req as any).user = verify
        next()
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed: Invalid token' });

    }

}