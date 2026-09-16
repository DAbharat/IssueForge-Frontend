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
