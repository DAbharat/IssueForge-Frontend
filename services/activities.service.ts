import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

export type IssueActivity = {
    id: string;
    issue_id: string;
    actor_id?: string;
    actor_name?: string;
    activity_type: string;
    field_name?: string;
    old_value?: string;
    new_value?: string;
    created_at?: string;
};

const getErrorMessage = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    return axiosError.response?.data?.message || axiosError.response?.data?.error || axiosError.message || fallback;
};

export async function listIssueActivities(issueId: string | number) {
    try {
        const response = await axiosClient.get<IssueActivity[]>(`/api/issues/${issueId}/activities`);
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while fetching issue activities."));
    }
}

export type ProjectActivity = {
    id: string | number;
    project_id: string | number;
    actor_id: string | number;
    actor_name?: string;
    actor_username?: string;
    target_user_id?: string | number | null;
    target_user_name?: string | null;
    target_user_username?: string | null;
    activity_type: string;
    field_name?: string | null;
    old_value?: string | null;
    new_value?: string | null;
    created_at?: string;
};

export async function listProjectActivities(projectId: string | number, limit = 20, offset = 0) {
    try {
        const response = await axiosClient.get<ProjectActivity[]>(`/api/projects/${projectId}/activities`, {
            params: { limit, offset },
        });
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error, "An error occurred while fetching project activities."));
    }
}

