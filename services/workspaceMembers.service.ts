import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

export type WorkspaceMember = {
    id?: string | number;
    user_id?: string | number;
    workspace_id?: string | number;
    email?: string;
    fullname?: string;
    username?: string;
    role?: string;
    created_at?: string;
    joined_at?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    return axiosError.response?.data?.message || axiosError.response?.data?.error || axiosError.message || fallback;
};

export async function addWorkspaceMember(workspaceId: string | number, userId: string | number, role: string = "MEMBER") {
    try {
        const response = await axiosClient.post<WorkspaceMember>(`/api/workspaces/${workspaceId}/members`, {
            user_id: Number(userId),
            role,
        });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while adding the workspace member."));
    }
}

export async function getWorkspaceMember(workspaceId: string | number, userId: string | number) {
    try {
        const response = await axiosClient.get<WorkspaceMember>(`/api/workspaces/${workspaceId}/members/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while fetching the workspace member."));
    }
}

export async function listUserWorkspaces() {
    try {
        const response = await axiosClient.get<WorkspaceMember[]>("/api/workspaces");
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while listing user workspaces."));
    }
}

export async function listWorkspaceMembers(workspaceId: string | number) {
    try {
        const response = await axiosClient.get<WorkspaceMember[]>(`/api/workspaces/${workspaceId}/members`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while listing workspace members."));
    }
}

export async function removeWorkspaceMember(workspaceId: string | number, userId: string | number) {
    try {
        const response = await axiosClient.delete(`/api/workspaces/${workspaceId}/members/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while removing the workspace member."));
    }
}

export async function promoteWorkspaceMember(workspaceId: string | number, userId: string | number) {
    try {
        const response = await axiosClient.patch<WorkspaceMember>(`/api/workspaces/${workspaceId}/member/promote`, {
            user_id: Number(userId),
        });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while promoting the workspace member."));
    }
}
