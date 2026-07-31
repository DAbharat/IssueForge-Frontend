import axiosClient from "@/lib/axiosClient";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";

export async function register(userData: {
    fullname: string;
    display_name: string;
    email: string;
    password: string
}) {
    try {
        const response = await axiosClient.post(`/api/register`, userData)
        return {
            ...response.data.user,
            accessToken: response.data.accessToken
        }
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        console.error("Error registering account: ", axiosError.response?.data.message || axiosError.message)
        throw new Error(axiosError.response?.data.message || "An error occurred while registering user")
    }
}

export async function login(userData: {
    email: string;
    password: string;
}) {
    try {
        const response = await axiosClient.post(`/api/login`, userData)
        return {
            ...response.data.user,
            accessToken: response.data.accessToken
        }
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        console.error("Error logging in account: ", axiosError.response?.data.message || axiosError.message)
        throw new Error(axiosError.response?.data.message || "An error occurred while logging in user")
    }
}