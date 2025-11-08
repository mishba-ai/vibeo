// response structure for successful upload

export interface UploadResponse {
    success:boolean;
    message:string;
    data:{
        url:string;
        publicId:string;
        format:string;
        width?: number;
        height?: number;
        size:number;
    };
}

export interface MultipleUploadResponse {
    success:boolean;
    message:string;
    data:UploadResponse['data'][];
}

//error response structure
export interface ErrorResponse {
    success:false;
    message:string;
    error?:string
}