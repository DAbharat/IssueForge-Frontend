import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

export type Issue = {
    id: string;
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    assigned_to?: string | number;
    assignee_name?: string;
    assignee_id?: string;
    creator_id?: string;
    project_id?: string;
    due_date?: string;
    created_at?: string;
    updated_at?: string;
};

export type CreateIssueRequest = {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    assignee_id?: string;
    due_date?: string;
};

export type UpdateIssueRequest = {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    assignee_id?: string;
    due_date?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    return axiosError.response?.data?.message || axiosError.response?.data?.error || axiosError.message || fallback;
};

export async function createIssue(projectId: string | number, data: CreateIssueRequest) {
    try {
        const response = await axiosClient.post<Issue>(`/api/projects/${projectId}/issues`, data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while creating the issue."));
    }
}

export async function getIssueById(issueId: string | number) {
    try {
        const response = await axiosClient.get<Issue>(`/api/issues/${issueId}`);
        //console.log("response:", response.data)
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while fetching the issue."));
    }
}

export async function listProjectIssues(projectId: string | number) {
    try {
        const response = await axiosClient.get<Issue[]>(`/api/projects/${projectId}/issues`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while listing issues."));
    }
}

export async function updateIssueDetails(issueId: string | number, data: UpdateIssueRequest) {
    try {
        const response = await axiosClient.patch<Issue>(`/api/issues/${issueId}/details`, data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while updating the issue."));
    }
}

export async function updateIssueStatus(issueId: string | number, status: string) {
    try {
        const response = await axiosClient.patch<Issue>(`/api/issues/${issueId}/status`, { status });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while updating the issue status."));
    }
}

export async function updateIssueAssignee(issueId: string | number, assigneeId: string | number) {
    try {
        const response = await axiosClient.patch<Issue>(`/api/issues/${issueId}/assignee`, { assignee_id: assigneeId });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while updating the assignee."));
    }
}

export async function updateIssuePriority(issueId: string | number, priority: string) {
    try {
        const response = await axiosClient.patch<Issue>(`/api/issues/${issueId}/priority`, { priority });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while updating the priority."));
    }
}

export async function listAssignedIssues() {
    try {
        const response = await axiosClient.get<Issue[]>("/api/users/me/issues/assigned");
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while fetching assigned issues."));
    }
}

export async function listCreatedIssues() {
    try {
        const response = await axiosClient.get<Issue[]>("/api/users/me/issues/created");
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while fetching created issues."));
    }
}

export async function updateIssueDueDate(issueId: string | number, dueDate: string) {
    try {
        const response = await axiosClient.patch<Issue>(`/api/issues/${issueId}/due-date`, { due_date: dueDate });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while updating the due date."));
    }
}

export async function deleteIssue(issueId: string | number) {
    try {
        const response = await axiosClient.delete(`/api/issues/${issueId}`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while deleting the issue."));
    }
}

export async function restoreDeletedIssue(issueId: string | number) {
    try {
        const response = await axiosClient.patch<Issue>(`/api/issues/${issueId}/restore`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while restoring the issue."));
    }
}
