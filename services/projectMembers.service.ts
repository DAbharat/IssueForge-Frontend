import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

export type ProjectMember = {
    id?: string | number;
    user_id?: string | number;
    project_id?: string | number;
    fullname?: string;
    username?: string;
    email?: string;
    role?: string;
    created_at?: string;
    joined_at?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    return axiosError.response?.data?.message || axiosError.response?.data?.error || axiosError.message || fallback;
};

export async function addMemberToProject(projectId: string | number, userId: string | number) {
    try {
        const response = await axiosClient.post<ProjectMember>(`/api/projects/${projectId}/members`, { user_id: userId });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while adding the project member."));
    }
}

export async function listProjectMembers(projectId: string | number) {
    try {
        const response = await axiosClient.get<ProjectMember[]>(`/api/projects/${projectId}/members`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while listing project members."));
    }
}
