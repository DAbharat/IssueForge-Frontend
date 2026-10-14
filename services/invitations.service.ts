import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

export type WorkspaceInvitation = {
    id: string | number;
    workspace_id: string | number;
    email?: string;
    invited_by?: string | number;
    invited_user_id?: string | number;
    username?: string;
    fullname?: string;
    workspace_name?: string;
    inviter_username?: string;
    inviter_fullname?: string;
    status?: string;
    created_at?: string;
    responded_at?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    return axiosError.response?.data?.message || axiosError.response?.data?.error || axiosError.message || fallback;
};

export async function createWorkspaceInvitation(
    workspaceId: string | number,
    data: { email?: string; user_id?: number | string }
) {
    try {
        const payload =
            data.user_id !== undefined
                ? { user_id: Number(data.user_id) }
                : data;
        const response = await axiosClient.post<WorkspaceInvitation>(
            `/api/workspaces/${workspaceId}/invitations`,
            payload
        );
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while creating the invitation."));
    }
}

export async function getWorkspaceInvitation(invitationId: string | number) {
    try {
        const response = await axiosClient.get<WorkspaceInvitation>(`/api/invitations/${invitationId}`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while fetching the invitation."));
    }
}

export async function listPendingWorkspaceInvitations() {
    try {
        const response = await axiosClient.get<WorkspaceInvitation[]>("/api/invitations/pending");
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while listing pending invitations."));
    }
}

export async function listPendingWorkspaceInvitationsForWorkspace(workspaceId: string | number) {
    try {
        const response = await axiosClient.get<WorkspaceInvitation[]>(`/api/workspaces/${workspaceId}/invitations/pending`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while listing workspace invitations."));
    }
}

export async function acceptInvitation(invitationId: string | number) {
    try {
        const response = await axiosClient.post<WorkspaceInvitation>(`/api/invitations/${invitationId}/accept`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while accepting the invitation."));
    }
}

export async function declineInvitation(invitationId: string | number) {
    try {
        const response = await axiosClient.post<WorkspaceInvitation>(`/api/invitations/${invitationId}/decline`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while declining the invitation."));
    }
}

export async function cancelInvitation(invitationId: string | number) {
    try {
        const response = await axiosClient.post<WorkspaceInvitation>(`/api/invitations/${invitationId}/cancel`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while canceling the invitation."));
    }
}
