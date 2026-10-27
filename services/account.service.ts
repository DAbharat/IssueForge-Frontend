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

export async function searchUsers(query: string = "", signal?: AbortSignal) {
    try {
        const response = await axiosClient.get<SearchUserResult[]>(`/api/users/search`, {
            params: query ? { search: query } : {},
            signal,
        });
        return response.data;
    } catch (error: any) {
        if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") {
            return [];
        }
        const axiosError = error as AxiosError<ApiResponse>;
        console.error("Error searching users: ", axiosError.response?.data?.message || axiosError.message);
        return [];
    }
}

export type GoogleLoginResponse = {
    access_token?: string;
    accessToken?: string;
    refresh_token?: string;
    refreshToken?: string;
    user: {
        id: number;
        username: string;
        fullname: string;
        email: string;
        workspaces: Array<{
            id: number;
            name: string;
            role: string;
            created_at?: string;
        }>;
    };
};

export function getGoogleOAuthUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
    return `${baseUrl}/api/auth/google`;
}

export async function handleGoogleCallback(code: string, state: string): Promise<GoogleLoginResponse> {
    try {
        const response = await axiosClient.get<GoogleLoginResponse>(`/api/auth/google/callback`, {
            params: { code, state },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse & { error?: string }>;
        const message = axiosError.response?.data?.error || axiosError.response?.data?.message || axiosError.message;
        console.error("Error completing Google sign-in: ", message);
        throw new Error(message || "An error occurred while completing Google sign-in");
    }
}

export async function logout(refreshToken?: string): Promise<{ message: string }> {
    try {
        const response = await axiosClient.post<{ message: string }>(`/api/users/logout`, {
            refresh_token: refreshToken || "",
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse & { error?: string }>;
        const message = axiosError.response?.data?.error || axiosError.response?.data?.message || axiosError.message;
        console.error("Error logging out: ", message);
        throw new Error(message || "An error occurred while logging out");
    }
}
