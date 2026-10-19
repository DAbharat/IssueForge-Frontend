import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

export type ArchiveCounts = {
    workspaces: number;
    projects: number;
    issues: number;
    attachments: number;
};

export type ArchivedWorkspace = {
    id: number | string;
    name: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
};

export type ArchivedProject = {
    id: number | string;
    workspace_id: number | string;
    workspace_name: string;
    lead_id: number | string;
    lead_name?: string;
    name: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
};

export type ArchivedIssue = {
    id: number | string;
    project_id: number | string;
    project_name: string;
    workspace_id: number | string;
    workspace_name: string;
    created_by: number | string;
    creator_name?: string;
    assigned_to?: number | string | null;
    assignee_name?: string | null;
    title: string;
    description?: string;
    status: string;
    priority: string;
    created_at?: string;
    updated_at?: string;
    due_date?: string | null;
    deleted_at?: string;
};

export type ArchivedAttachment = {
    id: number | string;
    issue_id: number | string;
    issue_title: string;
    project_id: number | string;
    project_name: string;
    uploaded_by: number | string;
    uploader_name?: string;
    original_name: string;
    resource_type?: string;
    mime_type?: string;
    file_size?: number;
    public_url?: string;
    created_at?: string;
    deleted_at?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    return axiosError.response?.data?.message || axiosError.response?.data?.error || axiosError.message || fallback;
};

export async function getArchiveCounts(): Promise<ArchiveCounts> {
    try {
        const response = await axiosClient.get<ArchiveCounts>("/api/archive/counts");
        return response.data ?? { workspaces: 0, projects: 0, issues: 0, attachments: 0 };
    } catch {
        return { workspaces: 0, projects: 0, issues: 0, attachments: 0 };
    }
}

export async function listArchivedWorkspaces(search?: string, signal?: AbortSignal): Promise<ArchivedWorkspace[]> {
    try {
        const params = search ? { search } : {};
        const response = await axiosClient.get<ArchivedWorkspace[]>("/api/archive/workspaces", { params, signal });
        return response.data ?? [];
    } catch {
        return [];
    }
}

export async function listArchivedProjects(search?: string, signal?: AbortSignal): Promise<ArchivedProject[]> {
    try {
        const params = search ? { search } : {};
        const response = await axiosClient.get<ArchivedProject[]>("/api/archive/projects", { params, signal });
        return response.data ?? [];
    } catch {
        return [];
    }
}

export async function listArchivedIssues(search?: string, signal?: AbortSignal): Promise<ArchivedIssue[]> {
    try {
        const params = search ? { search } : {};
        const response = await axiosClient.get<ArchivedIssue[]>("/api/archive/issues", { params, signal });
        return response.data ?? [];
    } catch {
        return [];
    }
}

export async function listArchivedAttachments(search?: string, signal?: AbortSignal): Promise<ArchivedAttachment[]> {
    try {
        const params = search ? { search } : {};
        const response = await axiosClient.get<ArchivedAttachment[]>("/api/archive/attachments", { params, signal });
        return response.data ?? [];
    } catch {
        return [];
    }
}

