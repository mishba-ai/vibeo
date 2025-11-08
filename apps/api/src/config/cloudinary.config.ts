import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs/promises'
import { resolve } from 'path';



interface cloudinaryResult {
    public_id: string;      // Unique identifier for the uploaded file
    secure_url: string;     // HTTPS URL to access the file
    url: string;           // HTTP URL to access the file
    format: string;        // File format (jpg, png, pdf, etc.)
    resource_type: string; // Type of resource (image, video, raw, etc.)
    [key: string]: any;    // Additional properties from Cloudinary response
}
cloudinary.config({
    secure: true,
    cloudinary_url: process.env.CLOUDINARY_URL
})



// async function uploadToCloudinary(imageFilePath: string, folderName: string): Promise<cloudinaryResult> {
//     try {
//         // check if file exists before attempting upload
//         await fs.access(imageFilePath);

//         //upload file to cloudinary with configuratin
//         const result = await cloudinary.uploader.upload(imageFilePath, {
//             folder: folderName,
//             resource_type: 'auto',
//             quality: 'auto:best',
//             fetch_format: 'auto',
//             flags: 'progressive'
//         })
//         console.log(`upload successful:${result.public_id}`);
//         console.log(`Secure URL: ${result.secure_url}`);
//         //  Clean up local file after successful upload

//         await cleanupLocalfile(imageFilePath)


//         return result
//     } catch (error) {
//         console.error('cloudinary upload errr', error)
//         // Attempt cleanup of local file if upload failed
//         await cleanupLocalfile(imageFilePath, true)
//         // Re-throw with more descriptive error message

//         throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'unknown error'}`);

//     }
// }

// Helper function to delete from Cloudinary
//  * Deletes a file from Cloudinary using its public ID

 const uploadToCloudinary = (
    fileBuffer: Buffer,
    folder: string = 'uploads'
): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,  //organize files in cloudinary dashboard
                resource_type: 'auto'
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result)
                }
            }
        );

        uploadStream.end(fileBuffer)
    })
}

// async function cleanupLocalfile(filePath: string, isFailureCleanup: boolean = false): Promise<void> {
//     try {
//         await fs.access(filePath);
//         // Delete the file

//         await fs.unlink(filePath);
//         const message = isFailureCleanup
//             ? `Cleaned up local file after failed upload: ${filePath}`
//             : `Successfully deleted local file: ${filePath}`;
//         console.log(message);
//     } catch (cleanupError: any) {
//         if (cleanupError.code === 'ENOENT') {
//             console.log(`File already deleted or doesn't exist: ${filePath}`);
//         } else {
//             const severity = isFailureCleanup ? 'warn' : 'error';
//             console[severity](`Could not delete local file ${filePath}:`, cleanupError.message);
//         }
//     }
// }

async function deleteFromCloudinary(publicId: string): Promise<any> {
    if (!publicId || typeof publicId !== 'string') {
        throw new Error('Valid public ID is required');
    }
    try {
        console.log(`Attempting to delete from Cloudinary: ${publicId}`);
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });

        console.log(`Cloudinary delete result for ${publicId}:`, result);

        // Check if deletion was successful
        if (result.result === 'ok') {
            console.warn(`Successfully deleted from Cloudinary: ${publicId}`);
        } else if (result.result === 'not found') {
            console.warn(`File not found in Cloudinary: ${publicId}`);
        } else {
            console.warn(`Unexpected deletion result:`, result);
        }
        return result;
    } catch (error) {
        console.error(`Error deleting from Cloudinary:`, error);
        return {
            success: false,
            publicId,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

/**
 * Extracts the public ID from a Cloudinary URL
 * Cloudinary URLs follow this pattern:
 * https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{transformations}/{folder}/{filename}.{extension}
 * 
 * The public ID is: {folder}/{filename} (without extension)
 */

function extractPublicIdFromUrl(url: string): string | null {
    try {
        // Split URL into parts
        const urlParts = url.split("/")

        // Get filename with extension (last part of URL)
        const fileWithExtension = urlParts[urlParts.length - 1]
        if (!fileWithExtension) {
            console.error('Invalid Cloudinary URL: missing file name');
            return null;
        }


        // Remove file extension to get filename 

        const fileName = fileWithExtension.split('.')[0]
        if (!fileName) {
            console.error('Invalid Cloudinary URL: missing file name');
            return null;
        }
        // Find the 'upload' segment in URL to locate folder structure
        const folderStartIndex = urlParts.findIndex((part) => part === 'upload')

        // If folders exist, include them in public ID
        if (folderStartIndex !== -1 && folderStartIndex + 2 < urlParts.length) {
            // Get folder path (everything between 'upload' and filename)
            const folderPath = urlParts.slice(folderStartIndex + 2, -1).join('/');
            return folderPath ? `${folderPath}/${fileName}` : fileName;
        }
        return fileName

    } catch (error) {
        console.error('Error extracting public_id from URL:', error)
        return null;
    }
}

export {
    uploadToCloudinary,
    deleteFromCloudinary,
    // cleanupLocalfile,
    extractPublicIdFromUrl,
    cloudinary,
    type cloudinaryResult
};