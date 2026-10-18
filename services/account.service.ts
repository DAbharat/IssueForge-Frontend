import axiosClient from "@/lib/axiosClient";
import { ApiResponse } from "@/types/ApiResponse";
import { AxiosError } from "axios";

export async function register(userData: {
    username: string;
    fullname: string;
    email: string;
    password: string
}) {
    try {
        const response = await axiosClient.post(`/api/register`, userData)
        return response.data
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse<null> & { error?: string }>
        const message = axiosError.response?.data.error || axiosError.response?.data.message || axiosError.message
        console.error("Error registering account: ", message)
        throw new Error(message || "An error occurred while registering user")
    }
}

export async function login(userData: {
    email: string;
    password: string;
}) {
    try {
        const response = await axiosClient.post(`/api/login`, userData)
        return response.data
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse & { error?: string }>
        const message = axiosError.response?.data.error || axiosError.response?.data.message || axiosError.message
        console.error("Error logging in account: ", message)
        throw new Error(message || "An error occurred while logging in user")
    }
}

export async function me() {
    try {
        const response = await axiosClient.get(`/api/me`)
        return response.data
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse & { error?: string }>
        const message = axiosError.response?.data.error || axiosError.response?.data.message || axiosError.message
        console.error("Error fetching account: ", message)
        throw new Error(message || "An error occurred while fetching account")
    }
}

export type SearchUserResult = {
    id: number;
    username: string;
    fullname: string;
    created_at?: string;
};

export async function searchUsers(query: string = "") {
    try {
        const response = await axiosClient.get<SearchUserResult[]>(`/api/users/search`, {
            params: query ? { search: query } : {},
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        console.error("Error searching users: ", axiosError.response?.data.message || axiosError.message);
        return [];
    }
}