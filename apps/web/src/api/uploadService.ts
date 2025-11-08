import type { AxiosProgressEvent } from 'axios';
import api from './axiosInstance'

export interface UploadResponse {
    success: boolean;
    message: string;
    data: {
        url: string;
        publicId: string;
        format: string;
        width?: string;
        height?: string;
        size: number;
    };
}

export interface MultipleUploadResponse {
    success: boolean;
    message: string;
    data: UploadResponse['data'][]
}

export const uploadSingleFile = async (
    file: File,
    onProgress?: (progress: number) => void
): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file)

    //make post request
    const response = await api.post<UploadResponse>(
        `api/v1/upload/single`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (ProgressEvent: AxiosProgressEvent) => {
                if (ProgressEvent.total && onProgress) {
                    const percentCompleted = Math.round(
                        ProgressEvent.loaded * 100 / ProgressEvent.total
                    );
                    onProgress(percentCompleted)
                }
            }
        }
    );
    return response.data
}


export const uploadMultipleFiles = async (
    files: File[],
    onProgress?: (progress: number) => void
): Promise<MultipleUploadResponse> => {

    const formData = new FormData()

    //append all files with same field name 'files'

    files.forEach((file) => {
        formData.append('files', file)
    })

    const response = await api.post<MultipleUploadResponse>(
        `api/v1/upload/multiple`,
        formData,
        {
            onUploadProgress: (ProgressEvent: AxiosProgressEvent) => {
                if (ProgressEvent.total && onProgress) {
                    const percentCompleted = Math.round(
                        (ProgressEvent.loaded * 100) / ProgressEvent.total
                    );
                    onProgress(percentCompleted);
                }
            }
        }
    );
    return response.data
}

export const deleteFile = async (publicId: string): Promise<void> => {
    const encodedPublicId = encodeURIComponent(publicId);
    await api.delete(`{API_BASE_URL}/${encodedPublicId}`)
}