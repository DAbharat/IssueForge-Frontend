export type NotificationType =
  | "WORKSPACE_INVITATION_RECEIVED"
  | "WORKSPACE_INVITATION_DECLINED"
  | "WORKSPACE_INVITATION_ACCEPTED"
  | "WORKSPACE_MEMBER_REMOVED"
  | "WORKSPACE_ARCHIVED"
  | "WORKSPACE_RESTORED"
  | "WORKSPACE_DELETED"
  | "WORKSPACE_MEMBER_ADDED"
  | "WORKSPACE_DETAILS_UPDATED"
  | "NEW_PROJECT_CREATED"
  | "PROJECT_MEMBER_ADDED"
  | "PROJECT_LEAD_ADDED"
  | "PROJECT_MEMBER_REMOVED"
  | "PROJECT_ARCHIVED"
  | "PROJECT_RESTORED"
  | "PROJECT_DELETED"
  | "PROJECT_LEAD_REMOVED"
  | "PROJECT_LEAD_CHANGED"
  | "PROJECT_DETAILS_UPDATED"
  | "NEW_ISSUE_CREATED"
  | "ISSUE_ASSIGNED_TO_YOU"
  | "ISSUE_ASSIGNEE_REMOVED"
  | "ISSUE_STATUS_CHANGED"
  | "ISSUE_PRIORITY_CHANGED"
  | "ISSUE_DETAILS_UPDATED"
  | "ISSUE_ARCHIVED"
  | "ISSUE_RESTORED"
  | "ISSUE_DELETED"
  | "ISSUE_COMMENT_ADDED"
  | "COMMENT_REPLY"
  | string;

export interface NotificationItem {
  id: number;
  recepient_id: number;
  sender_id: number | null;
  notification_type: NotificationType;
  title: string;
  message: string;
  project_id: number | null;
  issue_id: number | null;
  workspace_id: number | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UnreadCountResponse {
  unread_count: number;
}
