import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

export type WorkspaceInvitation = {
    id: string;
    workspace_id: string;
    email?: string;
    invited_by?: string;
    status?: string;
    created_at?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    return axiosError.response?.data?.message || axiosError.response?.data?.error || axiosError.message || fallback;
};

export async function createWorkspaceInvitation(workspaceId: string | number, data: { email: string }) {
    try {
        const response = await axiosClient.post<WorkspaceInvitation>(`/api/workspaces/${workspaceId}/invitations`, data);
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
        const response = await axiosClient.post<WorkspaceInvitation>(`/api/invitations/${invitationId}/decline`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while canceling the invitation."));
    }
}
