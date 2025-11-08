import { cloudinary } from "@/config";
import { Request, Response, NextFunction } from "express";
import { uploadToCloudinary, deleteFromCloudinary } from "@/config";
import {
    UploadResponse,
    MultipleUploadResponse,
    ErrorResponse,
} from '@/@types/upload';
import { RequestHandler } from 'express';


/*
 * CONTROLLER: Upload Single File
 
 * Flow:
 * 1. Multer already processed the file (it's in req.file)
 * 2. Validate file exists
 * 3. Upload buffer to Cloudinary
 * 4. Return URL and metadata

*/

export const uploadSingleFile:RequestHandler = async (
    req, 
    res, 
    next
)=> {
    try {
        //check if file exists
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: 'no file uploaded'
            } as ErrorResponse);
            return;
        }

        // upload to cloudinary
        const result = await uploadToCloudinary(req.file.buffer, 'user-uploads');

        //return success response
        // uploadResult contains: public_id, url, secure_url, format, etc.

        res.status(200).json({
            success: true,
            message: 'file uploaded successfully',
            data: {
                url: result.secure_url, //https url to access file
                publicId: result.public_id, //save this to delete later
                format: result.format,
                width: result.width,
                height: result.height,
                size: result.bytes,
            },
        } as UploadResponse)

    } catch (error: any) {
        console.error('upload error', error);
        res.status(500).json({
            success: false,
            message: 'failed to upload file',
            error: error.message,
        } as ErrorResponse)
    }
}

/*
CONTROLLER: upload multiple files
process array of files
*/
export const uploadMultipleFiles:RequestHandler = async (
    req,
    res,
    next
)=> {
    try {
        // check if files exist (multer sets req.files for array uploads)
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            res.status(400).json({
                success: false,
                message: 'No files uploaded',
            } as ErrorResponse)
            return;
        }

        //Upload all files concurrently 
        // Promise.all runs all uploads in parallel
        const uploadPromises = req.files.map((file) => 
            uploadToCloudinary(file.buffer, 'user-uploads')
        );

        //wait for all uploads to complete
        const results = await Promise.all(uploadPromises);

        //format response data
        const uploadedFiles = results.map((result) => ({
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            size: result.bytes,
        }))

        res.status(200).json({
            success: true,
            message: `${uploadedFiles.length} files uploaded successfully`,
            data: uploadedFiles
        } as MultipleUploadResponse)
        
    } catch (error: any) {
        console.error('upload error : ', error);
        res.status(500).json({
            success: false,
            message: 'failed to upload files',
            error: error.message
        } as ErrorResponse)
    }
}

/*
CONTROLLER: Delete file from Cloudinary
*/
export const deleteFile = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { publicId } = req.params;
        
        if (!publicId) {
            res.status(400).json({
                success: false,
                message: 'Public ID is required',
            } as ErrorResponse);
            return;
        }

        // delete from cloudinary
        const result = await deleteFromCloudinary(publicId)
        
        if (result.result === 'ok') {
            res.status(200).json({
                success: true,
                message: 'File deleted successfully',
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'File not found',
            } as ErrorResponse);
        }
        
    } catch (error: any) {
        console.error('delete error: ', error);
        res.status(500).json({
            success: false,
            message: 'failed to delete file',
            error: error.message
        } as ErrorResponse)
    }
}