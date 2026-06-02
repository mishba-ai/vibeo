import { prisma } from "./prisma.config.js";
import { passport } from "./passport.config.js";
import { cloudinary, uploadToCloudinary, deleteFromCloudinary, extractPublicIdFromUrl, cloudinaryResult } from "./cloudinary.config.js";

export {
  prisma,
  passport,
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  type cloudinaryResult,
  extractPublicIdFromUrl,
  
};