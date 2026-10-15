export type NavLink = {
  label: string
  href: string
}

export type PriorityLevel = "low" | "medium" | "high"

export type IssueStatus = "todo" | "in_progress" | "done"

export type PreviewIssue = {
  id: number
  title: string
  status: IssueStatus
  priority: PriorityLevel
  label: string
  labelClass: string
}

export type BentoFeature = {
  id: string
  title: string
  description: string
  colSpan: string
}

export type WorkflowStep = {
  step: string
  title: string
  description: string
  isAccent?: boolean
}

export type AuditItem = {
  user: string
  action: string
  target: string
  highlight?: string
  badge?: string
  time: string
}
