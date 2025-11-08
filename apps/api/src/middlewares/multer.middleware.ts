import multer from 'multer'
import { Request, RequestHandler } from 'express';
// memory storage
//files stored as buffer in RAM (req.fule.buffer)

//file filter
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback) => {
    // Allowed MIME types
    const allowedMimes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
    ];
    if (allowedMimes.includes(file.mimetype)) {
        //accept the file
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
}

const storage = multer.memoryStorage();


// configure multer
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, //5MB
        files:5, //max files at once
    }
})


export const uploadSingle: RequestHandler = upload.single('file');
export const uploadMultiple: RequestHandler = upload.array('files', 5);