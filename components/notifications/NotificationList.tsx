"use client";

import React from "react";
import { NotificationItem } from "@/types/notification";
import { NotificationCard } from "./NotificationCard";
import { BellOff, CheckCircle2 } from "lucide-react";

export interface NotificationListProps {
  notifications: NotificationItem[];
  isLoading: boolean;
  filter: "all" | "unread";
  onSelect: (notification: NotificationItem) => void;
  onMarkAsRead: (id: number, e: React.MouseEvent) => void;
  onDelete: (id: number, e: React.MouseEvent) => void;
}

export function NotificationList({
  notifications,
  isLoading,
  filter,
  onSelect,
  onMarkAsRead,
  onDelete,
}: NotificationListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="flex animate-pulse items-start gap-3 rounded-md border border-[#27272A]/50 bg-[#141418] p-3"
          >
            <div className="h-8 w-8 shrink-0 rounded-md bg-[#27272A]" />
            <div className="flex-1 space-y-2 py-0.5">
              <div className="flex justify-between">
                <div className="h-3 w-2/5 rounded bg-[#27272A]" />
                <div className="h-2.5 w-10 rounded bg-[#27272A]" />
              </div>
              <div className="h-2.5 w-4/5 rounded bg-[#27272A]/70" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        {filter === "unread" ? (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#27272A] bg-[#18181B] text-[#DDE1E5]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h4 className="mt-3 text-xs font-medium text-[#E2E8F0]">All caught up</h4>
            <p className="mt-1 text-[11px] text-[#71717A]">
              You have no unread notifications at this time.
            </p>
          </>
        ) : (
          <>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#27272A] bg-[#18181B] text-[#71717A]">
              <BellOff className="h-5 w-5" />
            </div>
            <h4 className="mt-3 text-xs font-medium text-[#E2E8F0]">No notifications</h4>
            <p className="mt-1 text-[11px] text-[#71717A]">
              You don&apos;t have any notifications right now.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      {notifications.map((item) => (
        <NotificationCard
          key={item.id}
          notification={item}
          onSelect={onSelect}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
