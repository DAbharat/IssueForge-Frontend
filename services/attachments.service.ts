import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

export type Attachment = {
    id: string | number;
    issue_id: string | number;
    comment_id?: string | number | null;
    original_name: string;
    url?: string;
    mime_type?: string;
    resource_type?: string;
    file_size?: number;
    created_at?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    return axiosError.response?.data?.message || axiosError.response?.data?.error || axiosError.message || fallback;
};

export async function createAttachment(issueId: string | number, formData: FormData) {
    try {
        const response = await axiosClient.post<Attachment>(
            `/api/issues/${issueId}/attachments`,
            formData,
            {
                headers: {
                    "Content-Type": undefined,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while uploading the attachment."));
    }
}

export async function getAttachmentById(attachmentId: string | number) {
    try {
        const response = await axiosClient.get<Attachment>(`/api/attachments/${attachmentId}`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while fetching the attachment."));
    }
}

export async function listIssueAttachments(issueId: string | number) {
    try {
        const response = await axiosClient.get<Attachment[]>(`/api/issues/${issueId}/attachments`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while listing issue attachments."));
    }
}

export async function listCommentAttachments(commentId: string | number) {
    try {
        const response = await axiosClient.get<Attachment[]>(`/api/comments/${commentId}/attachments`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while listing comment attachments."));
    }
}

export async function deleteAttachment(attachmentId: string | number) {
    try {
        const response = await axiosClient.delete(`/api/attachments/${attachmentId}`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while deleting the attachment."));
    }
}

export async function restoreAttachment(attachmentId: string | number) {
    try {
        const response = await axiosClient.post<{ attachmentID: number }>(`/api/attachments/${attachmentId}/restore`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while restoring the attachment."));
    }
}

