import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

export type Label = {
    id: string;
    name: string;
    color?: string;
    project_id?: string;
    created_at?: string;
    updated_at?: string;
};

export type CreateLabelRequest = {
    name: string;
    color?: string;
};

export type UpdateLabelRequest = {
    name?: string;
    color?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    return axiosError.response?.data?.message || axiosError.response?.data?.error || axiosError.message || fallback;
};

export async function createLabel(projectId: string | number, data: CreateLabelRequest) {
    try {
        const response = await axiosClient.post<Label>(`/api/projects/${projectId}/labels`, data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while creating the label."));
    }
}

export async function getLabelById(labelId: string | number) {
    try {
        const response = await axiosClient.get<Label>(`/api/labels/${labelId}`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while fetching the label."));
    }
}

export async function listProjectLabels(projectId: string | number) {
    try {
        const response = await axiosClient.get<Label[]>(`/api/projects/${projectId}/labels`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while listing labels."));
    }
}

export async function updateLabel(labelId: string | number, data: UpdateLabelRequest) {
    try {
        const response = await axiosClient.patch<Label>(`/api/labels/${labelId}`, data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while updating the label."));
    }
}

export async function deleteLabel(labelId: string | number) {
    try {
        const response = await axiosClient.delete(`/api/labels/${labelId}`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while deleting the label."));
    }
}

export async function attachLabelsToIssue(issueId: string | number, labelIds: Array<string | number>) {
    try {
        const response = await axiosClient.post(`/api/issues/${issueId}/labels`, { label_ids: labelIds });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while attaching labels."));
    }
}

export async function removeLabelFromIssue(issueId: string | number, labelId: string | number) {
    try {
        const response = await axiosClient.delete(`/api/issues/${issueId}/labels/${labelId}`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while removing the label."));
    }
}

export async function listIssueLabels(issueId: string | number) {
    try {
        const response = await axiosClient.get<Label[]>(`/api/issues/${issueId}/labels`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while listing issue labels."));
    }
}
