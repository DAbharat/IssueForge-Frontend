"use client";

import React from "react";
import { NotificationItem } from "@/types/notification";
import {
  AlertCircle,
  Briefcase,
  Check,
  CheckCircle2,
  FolderGit2,
  MessageSquare,
  Shield,
  Trash2,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";

export interface NotificationCardProps {
  notification: NotificationItem;
  onSelect: (notification: NotificationItem) => void;
  onMarkAsRead: (id: number, e: React.MouseEvent) => void;
  onDelete: (id: number, e: React.MouseEvent) => void;
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "WORKSPACE_INVITATION_RECEIVED":
    case "WORKSPACE_MEMBER_ADDED":
      return <UserPlus className="h-4 w-4 text-[#DDE1E5]" />;
    case "WORKSPACE_INVITATION_ACCEPTED":
      return <UserCheck className="h-4 w-4 text-[#DDE1E5]" />;
    case "WORKSPACE_INVITATION_DECLINED":
    case "WORKSPACE_MEMBER_REMOVED":
      return <UserMinus className="h-4 w-4 text-[#94A3B8]" />;
    case "WORKSPACE_DETAILS_UPDATED":
    case "WORKSPACE_ARCHIVED":
    case "WORKSPACE_RESTORED":
    case "WORKSPACE_DELETED":
      return <Briefcase className="h-4 w-4 text-[#94A3B8]" />;
    case "NEW_PROJECT_CREATED":
    case "PROJECT_DETAILS_UPDATED":
    case "PROJECT_ARCHIVED":
    case "PROJECT_RESTORED":
    case "PROJECT_DELETED":
      return <FolderGit2 className="h-4 w-4 text-[#94A3B8]" />;
    case "PROJECT_MEMBER_ADDED":
    case "PROJECT_MEMBER_REMOVED":
      return <Users className="h-4 w-4 text-[#94A3B8]" />;
    case "PROJECT_LEAD_CHANGED":
    case "PROJECT_LEAD_ADDED":
    case "PROJECT_LEAD_REMOVED":
      return <Shield className="h-4 w-4 text-[#DDE1E5]" />;
    case "NEW_ISSUE_CREATED":
    case "ISSUE_ASSIGNED_TO_YOU":
      return <AlertCircle className="h-4 w-4 text-[#DDE1E5]" />;
    case "ISSUE_STATUS_CHANGED":
      return <CheckCircle2 className="h-4 w-4 text-[#DDE1E5]" />;
    case "ISSUE_PRIORITY_CHANGED":
    case "ISSUE_DETAILS_UPDATED":
    case "ISSUE_ASSIGNEE_REMOVED":
    case "ISSUE_ARCHIVED":
    case "ISSUE_RESTORED":
    case "ISSUE_DELETED":
      return <AlertCircle className="h-4 w-4 text-[#94A3B8]" />;
    case "ISSUE_COMMENT_ADDED":
    case "COMMENT_REPLY":
      return <MessageSquare className="h-4 w-4 text-[#DDE1E5]" />;
    default:
      return <AlertCircle className="h-4 w-4 text-[#94A3B8]" />;
  }
}

function formatRelativeTime(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function NotificationCard({
  notification,
  onSelect,
  onMarkAsRead,
  onDelete,
}: NotificationCardProps) {
  const isUnread = !notification.is_read;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(notification)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(notification);
        }
      }}
      className={`group relative flex cursor-pointer items-start gap-3 rounded-md border p-3 text-left transition-colors ${
        isUnread
          ? "border-[#3F3F46] bg-[#18181B] hover:border-[#52525B] hover:bg-[#202024]"
          : "border-[#27272A]/70 bg-[#0E0E11] hover:border-[#27272A] hover:bg-[#141418]"
      }`}
    >
      {/* Icon badge */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${
          isUnread
            ? "border-[#3F3F46] bg-[#27272A]"
            : "border-[#27272A]/80 bg-[#18181B]"
        }`}
      >
        {getNotificationIcon(notification.notification_type)}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {isUnread && (
              <span
                aria-label="Unread"
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#DDE1E5]"
              />
            )}
            <h4
              className={`truncate text-xs font-medium leading-tight ${
                isUnread ? "text-[#E2E8F0]" : "text-[#94A3B8]"
              }`}
            >
              {notification.title}
            </h4>
          </div>

          <span className="shrink-0 text-[10px] text-[#71717A]">
            {formatRelativeTime(notification.created_at)}
          </span>
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#94A3B8]">
          {notification.message}
        </p>

        {/* Action buttons (always visible on touch, hover on desktop) */}
        <div className="mt-2.5 flex items-center justify-end gap-1.5">
          {isUnread && (
            <button
              type="button"
              title="Mark as read"
              aria-label="Mark as read"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.id, e);
              }}
              className="flex h-6 items-center gap-1 rounded border border-[#27272A] bg-[#18181B] px-1.5 text-[10px] text-[#94A3B8] transition-colors hover:border-[#3F3F46] hover:bg-[#27272A] hover:text-[#E2E8F0]"
            >
              <Check className="h-3 w-3" />
              <span>Mark read</span>
            </button>
          )}

          <button
            type="button"
            title="Delete notification"
            aria-label="Delete notification"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id, e);
            }}
            className="flex h-6 w-6 items-center justify-center rounded border border-transparent text-[#71717A] transition-colors hover:border-[#27272A] hover:bg-[#18181B] hover:text-[#E2E8F0]"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
