"use client"

import { useEffect, useState } from "react"
import {
  attachLabelsToIssue,
  createLabel,
  deleteLabel,
  listIssueLabels,
  listProjectLabels,
  removeLabelFromIssue,
  type Label,
} from "@/services/labels.service"

export function useLabels(projectId: string | null, issueId: string | null = null) {
  const [projectLabels, setProjectLabels] = useState<Label[]>([])
  const [issueLabels, setIssueLabels] = useState<Label[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!projectId) return

    let cancelled = false

    const issueLabelsRequest = issueId ? listIssueLabels(issueId) : Promise.resolve([])

    Promise.all([listProjectLabels(projectId), issueLabelsRequest])
      .then(([available, assigned]) => {
        if (cancelled) return
        setProjectLabels(available)
        setIssueLabels(assigned)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load labels")
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [projectId, issueId])

  async function attachLabels(labelIds: Array<string | number>, targetIssueId = issueId) {
    if (!targetIssueId || labelIds.length === 0) return

    setIsUpdating(true)
    setError(null)
    try {
      await attachLabelsToIssue(targetIssueId, labelIds)
      const refreshed = await listIssueLabels(targetIssueId)
      setIssueLabels(refreshed)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to attach labels"
      setError(message)
      throw err
    } finally {
      setIsUpdating(false)
    }
  }

  async function createProjectLabel(name: string, color: string) {
    if (!projectId) return

    setIsUpdating(true)
    setError(null)
    try {
      const created = await createLabel(projectId, { name, color })
      setProjectLabels((current) => [...current, created])
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to create label"
      setError(message)
      throw err
    } finally {
      setIsUpdating(false)
    }
  }

  async function deleteProjectLabel(labelId: string | number) {
    setIsUpdating(true)
    setError(null)
    try {
      await deleteLabel(labelId)
      setProjectLabels((current) => current.filter((label) => String(label.id) !== String(labelId)))
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete label"
      setError(message)
      throw err
    } finally {
      setIsUpdating(false)
    }
  }

  async function removeLabel(labelId: string | number) {
    if (!issueId) return

    setIsUpdating(true)
    setError(null)
    try {
      await removeLabelFromIssue(issueId, labelId)
      setIssueLabels((current) => current.filter((label) => String(label.id) !== String(labelId)))
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to remove label"
      setError(message)
      throw err
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    projectLabels,
    issueLabels,
    isLoading,
    isUpdating,
    error,
    attachLabels,
    removeLabel,
    createProjectLabel,
    deleteProjectLabel,
  }
}
