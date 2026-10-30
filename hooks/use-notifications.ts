"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { NotificationItem } from "@/types/notification";
import {
  deleteAllNotifications,
  deleteNotification,
  getUnreadNotificationCount,
  listNotifications,
  listUnreadNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/services/notifications.service";

export type NotificationFilter = "all" | "unread";

export function useNotifications(options?: { autoFetch?: boolean; pollIntervalMs?: number }) {
  const { autoFetch = true, pollIntervalMs = 30000 } = options || {};

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchUnreadCount = useCallback(async (signal?: AbortSignal) => {
    try {
      const count = await getUnreadNotificationCount(signal);
      setUnreadCount(count);
    } catch {
      // quiet fail for background polling
    }
  }, []);

  const fetchNotifications = useCallback(
    async (currentFilter: NotificationFilter = filter) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        let data: NotificationItem[] = [];
        if (currentFilter === "unread") {
          data = await listUnreadNotifications(controller.signal);
        } else {
          data = await listNotifications({ limit: 50 }, controller.signal);
        }

        if (!controller.signal.aborted) {
          setNotifications(data);
        }
      } catch (err: unknown) {
        if (!controller.signal.aborted) {
          const message = err instanceof Error ? err.message : "Failed to load notifications";
          setError(message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    },
    [filter]
  );

  const handleFilterChange = useCallback(
    (newFilter: NotificationFilter) => {
      setFilter(newFilter);
      fetchNotifications(newFilter);
    },
    [fetchNotifications]
  );

  const handleMarkAsRead = useCallback(async (id: number) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_read: true, read_at: new Date().toISOString() } : item
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await markNotificationAsRead(id);
    } catch (err) {
      // Revert if critical error
      console.error("Failed to mark notification as read:", err);
    }
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, is_read: true, read_at: new Date().toISOString() }))
    );
    setUnreadCount(0);

    try {
      await markAllNotificationsAsRead();
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      // Refetch to sync state
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [fetchNotifications, fetchUnreadCount]);

  const handleDeleteNotification = useCallback(
    async (id: number) => {
      const target = notifications.find((n) => n.id === id);
      const wasUnread = target ? !target.is_read : false;

      // Optimistic update
      setNotifications((prev) => prev.filter((item) => item.id !== id));
      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      try {
        await deleteNotification(id);
      } catch (err) {
        console.error("Failed to delete notification:", err);
        fetchNotifications();
      }
    },
    [notifications, fetchNotifications]
  );

  const handleDeleteAll = useCallback(async () => {
    // Optimistic update
    setNotifications([]);
    setUnreadCount(0);

    try {
      await deleteAllNotifications();
    } catch (err) {
      console.error("Failed to delete all notifications:", err);
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [fetchNotifications, fetchUnreadCount]);

  // Initial fetch
  useEffect(() => {
    if (!autoFetch) return;

    fetchUnreadCount();
    fetchNotifications(filter);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoFetch, fetchUnreadCount, fetchNotifications, filter]);

  // Polling unread count periodically
  useEffect(() => {
    if (!autoFetch || pollIntervalMs <= 0) return;

    const interval = setInterval(() => {
      if (typeof document !== "undefined" && !document.hidden) {
        fetchUnreadCount();
      }
    }, pollIntervalMs);

    return () => clearInterval(interval);
  }, [autoFetch, pollIntervalMs, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    filter,
    isLoading,
    error,
    setFilter: handleFilterChange,
    refresh: () => {
      fetchNotifications(filter);
      fetchUnreadCount();
    },
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    deleteAllNotifications: handleDeleteAll,
  };
}
