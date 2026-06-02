import { Router } from "express";
const uploadRouter: Router = Router()
import { uploadMultipleFiles, uploadSingleFile, deleteFile } from "@/controllers/upload.controller.js";
import { uploadSingle, uploadMultiple } from '@/middlewares/multer.middleware.js'

/*
  UPLOAD ROUTES
 */

uploadRouter.post('/single', uploadSingle, uploadSingleFile);
uploadRouter.post('/multiple', uploadMultiple, uploadMultipleFiles);

uploadRouter.delete('/:publicId', deleteFile);


export { uploadRouter };