"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useNotifications, NotificationFilter } from "@/hooks/use-notifications";
import { NotificationItem } from "@/types/notification";
import { NotificationList } from "./NotificationList";
import { getNotificationDestination } from "./getNotificationDestination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, CheckCheck, Trash2 } from "lucide-react";

export function NotificationPopover() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    filter,
    isLoading,
    setFilter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotifications();

  const handleSelectNotification = async (notification: NotificationItem) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    const destination = getNotificationDestination(notification);
    setIsOpen(false);
    router.push(destination);
  };

  const handleMarkAsRead = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead(id);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(id);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        aria-label="Notifications"
        className="relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-sm bg-transparent p-0 text-[#94A3B8] transition-colors hover:bg-[#18181B] hover:text-[#E2E8F0] md:h-10 md:w-10 focus:outline-none"
      >
        <Bell className="h-4 w-4 md:h-5 md:w-5" />

        {/* Unread count badge */}
        {unreadCount > 0 && (
          <span
            aria-label={`${unreadCount} unread notifications`}
            className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#DDE1E5] px-1 text-[9px] font-bold text-black shadow-sm ring-1 ring-black animate-in fade-in zoom-in"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[22rem] sm:w-[26rem] p-0 rounded-lg border border-[#27272A] bg-[#0E0E11] text-[#E2E8F0] shadow-[0_12px_40px_rgba(0,0,0,0.85)] z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#27272A] px-3.5 py-3 bg-[#121216]">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#E2E8F0]">
              Notifications
            </h3>
            {unreadCount > 0 ? (
              <span className="rounded border border-[#3F3F46] bg-[#27272A] px-1.5 py-0.5 text-[10px] font-medium text-[#DDE1E5]">
                {unreadCount} unread
              </span>
            ) : (
              <span className="rounded border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 text-[10px] font-medium text-[#71717A]">
                Caught up
              </span>
            )}
          </div>

          {/* Header Quick Actions */}
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                title="Mark all as read"
                className="flex items-center gap-1 rounded px-1.5 py-1 text-[11px] font-medium text-[#94A3B8] transition-colors hover:bg-[#1E1E24] hover:text-[#E2E8F0]"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={deleteAllNotifications}
                title="Clear all notifications"
                className="flex items-center gap-1 rounded p-1 text-[#71717A] transition-colors hover:bg-[#1E1E24] hover:text-[#EF4444]"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center border-b border-[#27272A] bg-[#0E0E11] px-3 py-1.5">
          <div className="flex items-center gap-1 rounded-md bg-[#18181B] p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded px-2.5 py-1 font-medium transition-colors ${
                filter === "all"
                  ? "bg-[#27272A] text-[#E2E8F0] shadow-sm"
                  : "text-[#94A3B8] hover:text-[#E2E8F0]"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`flex items-center gap-1 rounded px-2.5 py-1 font-medium transition-colors ${
                filter === "unread"
                  ? "bg-[#27272A] text-[#E2E8F0] shadow-sm"
                  : "text-[#94A3B8] hover:text-[#E2E8F0]"
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[#3F3F46] px-1.5 py-0.2 text-[9px] text-[#DDE1E5]">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* List Body */}
        <div className="max-h-[26rem] overflow-y-auto overscroll-contain">
          <NotificationList
            notifications={notifications}
            isLoading={isLoading}
            filter={filter}
            onSelect={handleSelectNotification}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
          />
        </div>

        {/* Footer */}
        <div className="border-t border-[#27272A]/70 bg-[#121216]/60 px-3 py-2 text-center">
          <p className="text-[10px] text-[#71717A]">
            Click any notification to navigate to its details
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
