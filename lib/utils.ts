import axios from "axios"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
})


export const apiClientWithAuth = () => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    headers: {
      Authorization: localStorage.getItem("token")
    },
  })
}


export const FULL_AI_API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/ai/chat`;
export const ACHIEVEMENT_API_URL = "/user/achievement";
export const PROJECT_API_URL = "/user/project";
export const MEDIA_API_URL = "/media";
export const AUTHENTICATE_MEDIA_UPLOAD_URL = "/media/authenticate-upload";
export const AI_API_URL = "/ai";
export const USER_API_URL = "/user";
export const AUTH_API_URL = "/auth";


