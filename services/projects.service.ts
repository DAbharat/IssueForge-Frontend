import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

export type Project = {
    id: string;
    name: string;
    description?: string;
    workspace_id?: string;
    lead_id?: string;
    lead_name?: string;
    created_at?: string;
    updated_at?: string;
};

export type CreateProjectRequest = {
    name: string;
    description?: string;
    workspace_id?: string;
};

export type UpdateProjectDetailsRequest = {
    name?: string;
    description?: string;
};

export type UpdateProjectLeadRequest = {
    lead_id: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    return axiosError.response?.data?.message || axiosError.response?.data?.error || axiosError.message || fallback;
};

export async function createProject(workspaceId: string | number, data: CreateProjectRequest) {
    try {
        const response = await axiosClient.post<Project>(`/api/workspaces/${workspaceId}/projects`, data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while creating the project."));
    }
}

export async function getProjectById(projectId: string | number) {
    try {
        const response = await axiosClient.get<Project>(`/api/projects/${projectId}`);
        //console.log("response: ", response.data)
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while fetching the project."));
    }
}

export async function updateProjectDetails(projectId: string | number, data: UpdateProjectDetailsRequest) {
    try {
        const response = await axiosClient.patch<Project>(`/api/projects/${projectId}/details`, data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while updating the project details."));
    }
}

export async function updateProjectLead(projectId: string | number, data: UpdateProjectLeadRequest) {
    try {
        const response = await axiosClient.patch<Project>(`/api/projects/${projectId}/lead`, data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while updating the project lead."));
    }
}

export async function deleteProject(projectId: string | number) {
    try {
        const response = await axiosClient.delete(`/api/projects/${projectId}`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while deleting the project."));
    }
}

export async function listProjectsByLead(workspaceId: string | number) {
    try {
        const response = await axiosClient.get<Project[]>(`/api/workspaces/${workspaceId}/projects`);
        //console.log("response: ", response.data)
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while listing projects."));
    }
}

export async function restoreProject(projectId: string | number) {
    try {
        const response = await axiosClient.post<Project>(`/api/projects/${projectId}/restore`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while restoring the project."));
    }
}

