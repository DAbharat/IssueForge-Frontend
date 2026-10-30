import { NotificationItem } from "@/types/notification";

export function getNotificationDestination(notification: NotificationItem): string {
  const { notification_type, project_id, issue_id, workspace_id } = notification;

  // Comment events
  if (
    notification_type === "ISSUE_COMMENT_ADDED" ||
    notification_type === "COMMENT_REPLY"
  ) {
    if (project_id && issue_id) {
      return `/projects/${project_id}/issues/${issue_id}`;
    }
  }

  // Issue events
  if (notification_type.startsWith("ISSUE_")) {
    if (notification_type === "ISSUE_DELETED" || notification_type === "ISSUE_ARCHIVED") {
      return "/archive";
    }
    if (project_id && issue_id) {
      return `/projects/${project_id}/issues/${issue_id}`;
    }
    if (project_id) {
      return `/projects/${project_id}`;
    }
  }

  // Project events
  if (notification_type.includes("PROJECT")) {
    if (notification_type === "PROJECT_DELETED" || notification_type === "PROJECT_ARCHIVED") {
      return "/archive";
    }
    if (project_id) {
      return `/projects/${project_id}`;
    }
    return "/workspace?tab=projects";
  }

  // Workspace invitation events
  if (notification_type.includes("INVITATION")) {
    if (notification_type === "WORKSPACE_INVITATION_ACCEPTED") {
      return "/workspace?tab=members";
    }
    return "/workspace?tab=invitations";
  }

  // Workspace member events
  if (notification_type.includes("MEMBER")) {
    return "/workspace?tab=members";
  }

  // Workspace general events
  if (notification_type.includes("WORKSPACE")) {
    if (notification_type === "WORKSPACE_DETAILS_UPDATED") {
      return "/workspace?tab=details";
    }
    return "/workspace";
  }

  if (project_id && issue_id) {
    return `/projects/${project_id}/issues/${issue_id}`;
  }
  if (project_id) {
    return `/projects/${project_id}`;
  }
  if (workspace_id) {
    return "/workspace";
  }

  return "/workspace";
}
