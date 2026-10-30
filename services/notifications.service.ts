import axiosClient from "@/lib/axiosClient";
import { NotificationItem, UnreadCountResponse } from "@/types/notification";
import { AxiosError } from "axios";

export interface ListNotificationsParams {
  limit?: number;
  offset?: number;
  filter?: "unread";
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as AxiosError<{ message?: string; error?: string }>;
  return (
    axiosError.response?.data?.message ||
    axiosError.response?.data?.error ||
    axiosError.message ||
    fallback
  );
};

export async function listNotifications(
  params?: ListNotificationsParams,
  signal?: AbortSignal
): Promise<NotificationItem[]> {
  try {
    const response = await axiosClient.get<NotificationItem[]>("/api/notifications", {
      params,
      signal,
    });
    return response.data ?? [];
  } catch (error) {
    if (signal?.aborted) return [];
    throw new Error(getErrorMessage(error, "Failed to load notifications"));
  }
}

export async function listUnreadNotifications(
  signal?: AbortSignal
): Promise<NotificationItem[]> {
  try {
    const response = await axiosClient.get<NotificationItem[]>("/api/notifications/unread", {
      signal,
    });
    return response.data ?? [];
  } catch (error) {
    if (signal?.aborted) return [];
    throw new Error(getErrorMessage(error, "Failed to load unread notifications"));
  }
}

export async function getUnreadNotificationCount(
  signal?: AbortSignal
): Promise<number> {
  try {
    const response = await axiosClient.get<UnreadCountResponse>(
      "/api/notifications/unread/count",
      { signal }
    );
    return response.data?.unread_count ?? 0;
  } catch (error) {
    if (signal?.aborted) return 0;
    return 0;
  }
}

export async function getNotificationById(
  id: number,
  signal?: AbortSignal
): Promise<NotificationItem> {
  try {
    const response = await axiosClient.get<NotificationItem>(`/api/notifications/${id}`, {
      signal,
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to load notification"));
  }
}

export async function markNotificationAsRead(
  id: number
): Promise<NotificationItem> {
  try {
    const response = await axiosClient.patch<NotificationItem>(
      `/api/notifications/${id}/read`
    );
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to mark notification as read"));
  }
}

export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    await axiosClient.post("/api/notifications/read-all");
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to mark all notifications as read"));
  }
}

export async function deleteNotification(id: number): Promise<void> {
  try {
    await axiosClient.delete(`/api/notifications/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to delete notification"));
  }
}

export async function deleteAllNotifications(): Promise<void> {
  try {
    await axiosClient.delete("/api/notifications");
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to clear all notifications"));
  }
}
