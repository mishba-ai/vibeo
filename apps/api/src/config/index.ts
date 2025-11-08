import { prisma } from "./prisma.config";
import { passport } from "./passport.config";
import { cloudinary, uploadToCloudinary, deleteFromCloudinary, extractPublicIdFromUrl, cloudinaryResult } from "./cloudinary.config";

export {
  prisma,
  passport,
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  type cloudinaryResult,
  extractPublicIdFromUrl,
  
};