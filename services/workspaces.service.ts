import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

export type Workspace = {
    id: string | number;
    name: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
};

export type CreateWorkspaceRequest = {
    name: string;
    description?: string;
};

export type UpdateWorkspaceRequest = {
    name?: string;
    description?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    return axiosError.response?.data?.message || axiosError.response?.data?.error || axiosError.message || fallback;
};

export async function createWorkspace(data: CreateWorkspaceRequest) {
    try {
        const payload: { name: string } = {
            name: data.name.trim(),
        };
        const response = await axiosClient.post<Workspace>("/api/workspaces", payload);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while creating the workspace."));
    }
}

export async function getWorkspaceById(workspaceId: string | number) {
    try {
        const response = await axiosClient.get<Workspace>(`/api/workspaces/${workspaceId}`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while fetching the workspace."));
    }
}

export async function getWorkspaceByName(name: string) {
    try {
        const response = await axiosClient.get<Workspace>(`/api/workspaces/name/${encodeURIComponent(name)}`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while fetching the workspace by name."));
    }
}

export async function updateWorkspaceName(workspaceId: string | number, data: UpdateWorkspaceRequest) {
    try {
        const response = await axiosClient.patch<Workspace>(`/api/workspaces/${workspaceId}`, data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while updating the workspace."));
    }
}

export async function deleteWorkspace(workspaceId: string | number) {
    try {
        const response = await axiosClient.delete(`/api/workspaces/${workspaceId}`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while deleting the workspace."));
    }
}

export async function restoreDeletedWorkspace(workspaceId: string | number) {
    try {
        const response = await axiosClient.post<Workspace>(`/api/workspace/${workspaceId}`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while restoring the workspace."));
    }
}
