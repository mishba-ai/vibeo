import api from "@/api/axiosInstance"
import { useAuth } from "./useAuth"
import { useState, useEffect, useRef } from "react"

export const usePostComments = (postId: String) => {
  
    try {
        api.post(`api/v1/posts/${postId}/comment`)
    } catch (error) {
        console.error(error);
    }

    useEffect(() => { 

    }, [])

}