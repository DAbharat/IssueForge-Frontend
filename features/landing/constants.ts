import type {
  NavLink,
  PreviewIssue,
  WorkflowStep,
  AuditItem,
} from "./types"

export const NAV_LINKS: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Product", href: "#product-preview" },
]

export const HERO_HIGHLIGHTS = [
  "Multi-workspace isolation",
  "Role-based permissions",
  "Full audit activity stream",
]

export const PREVIEW_ISSUES: PreviewIssue[] = [
  {
    id: 104,
    title: "Implement JWT token rotation on 401 response",
    status: "todo",
    priority: "high",
    label: "security",
    labelClass: "border-red-500/20 text-red-300 bg-red-500/5",
  },
  {
    id: 108,
    title: "Keyboard shortcuts for issue triage",
    status: "todo",
    priority: "medium",
    label: "frontend",
    labelClass: "border-blue-500/20 text-blue-300 bg-blue-500/5",
  },
  {
    id: 102,
    title: "Granular workspace roles: Owner, Admin, Member",
    status: "in_progress",
    priority: "high",
    label: "backend",
    labelClass: "border-emerald-500/20 text-emerald-300 bg-emerald-500/5",
  },
  {
    id: 106,
    title: "Dark theme contrast audit across forms and dialogs",
    status: "in_progress",
    priority: "low",
    label: "design",
    labelClass: "border-zinc-500/30 text-zinc-300 bg-zinc-500/5",
  },
  {
    id: 98,
    title: "Workspace invitation email token generation",
    status: "done",
    priority: "high",
    label: "security",
    labelClass: "border-red-500/20 text-red-300 bg-red-500/5",
  },
  {
    id: 95,
    title: "Soft-delete and one-click restore for archived projects",
    status: "done",
    priority: "medium",
    label: "core",
    labelClass: "border-zinc-500/30 text-zinc-300 bg-zinc-500/5",
  },
]

export const PRIORITY_CONFIG = {
  high: { label: "High", dot: "bg-[#EF4444]" },
  medium: { label: "Medium", dot: "bg-[#CA8A04]" },
  low: { label: "Low", dot: "bg-[#71717A]" },
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: "01",
    title: "Create or join a workspace",
    description:
      "Start a workspace for your organization, or join your team through a secure invitation link.",
  },
  {
    step: "02",
    title: "Structure projects and issues",
    description:
      "Create scoped projects, assign leads, and log issues with labels, priorities, assignees, and due dates.",
  },
  {
    step: "03",
    title: "Track progress and ship",
    description:
      "Move tasks across Kanban stages, join issue discussions, and watch the audit stream.",
    isAccent: true,
  },
]

export const AUDIT_ITEMS: AuditItem[] = [
  {
    user: "Alex",
    action: "moved #102 to",
    target: "In Progress",
    highlight: "text-[#CA8A04]",
    time: "4m",
  },
  {
    user: "David",
    action: "completed #98",
    target: "",
    time: "18m",
  },
  {
    user: "Sarah",
    action: "labeled #104",
    target: "security",
    badge: "border-red-500/20 text-red-300 bg-red-500/5",
    time: "1h",
  },
]
