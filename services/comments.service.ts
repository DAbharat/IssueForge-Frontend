import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

export type Comment = {
    id: string | number;
    issue_id: string | number;
    author_id: string | number;
    author_name?: string;
    parent_comment_id?: string | null;
    content: string;
    is_edited?: boolean;
    created_at?: string;
    updated_at?: string;
};

export type CreateCommentRequest = {
    content: string;
    parent_comment_id?: string | number;
};

export type UpdateCommentRequest = {
    content: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    return axiosError.response?.data?.message || axiosError.response?.data?.error || axiosError.message || fallback;
};

export async function createComment(issueId: string | number, data: CreateCommentRequest) {
    try {
        const response = await axiosClient.post<Comment>(`/api/issues/${issueId}/comments`, {
            content: data.content,
            parent_comment_id:
                data.parent_comment_id === undefined
                    ? undefined
                    : Number(data.parent_comment_id),
        });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while creating the comment."));
    }
}

export async function getCommentById(commentId: string | number) {
    try {
        const response = await axiosClient.get<Comment>(`/api/comments/${commentId}`);
        console.log("response: ", response.data)
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while fetching the comment."));
    }
}

export async function listIssueComments(issueId: string | number) {
    try {
        const response = await axiosClient.get<Comment[]>(`/api/issues/${issueId}/comments`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while listing comments."));
    }
}

export async function updateComment(commentId: string | number, data: UpdateCommentRequest) {
    try {
        const response = await axiosClient.patch<Comment>(`/api/comments/${commentId}`, data);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while updating the comment."));
    }
}

export async function deleteComment(commentId: string | number) {
    try {
        const response = await axiosClient.delete(`/api/comments/${commentId}`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while deleting the comment."));
    }
}
