"use client"

import { useState, useEffect } from "react"
import { Globe, Copy, Pencil } from "lucide-react"

type WorkspaceDetailsProps = {
  workspaceId: string | number | null
  initialName: string
  initialDescription: string
  isAdmin: boolean
  onSave: (name: string, description: string) => Promise<void>
}

export default function WorkspaceDetails({
  workspaceId,
  initialName,
  initialDescription,
  isAdmin,
  onSave,
}: WorkspaceDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription)
  const [isSaving, setIsSaving] = useState(false)

  // Update local state if props change (e.g. after fetch completes)
  useEffect(() => {
    setName(initialName)
    setDescription(initialDescription)
  }, [initialName, initialDescription])

  const handleCancel = () => {
    setName(initialName)
    setDescription(initialDescription)
    setIsEditing(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(name, description)
      setIsEditing(false)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="h-full flex flex-col col-span-1 lg:col-span-2 rounded-md border border-[#27272A] bg-[#0E0E11] p-5">
      <h2 className="mb-4 text-base font-semibold text-[#E2E8F0]">Workspace Details</h2>
      
      <div className="space-y-3 flex-1 flex flex-col">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#E2E8F0]">
            Workspace name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
            className="w-full rounded-md border border-[#27272A] bg-[#09090B] px-3 py-2 text-sm text-[#E2E8F0] focus:border-[#3F3F46] focus:outline-none disabled:opacity-70"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#E2E8F0]">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!isEditing}
            className="w-full rounded-md border border-[#27272A] bg-[#09090B] px-3 py-2 text-sm text-[#E2E8F0] focus:border-[#3F3F46] focus:outline-none resize-none disabled:opacity-70"
          />
        </div>

        <div className="flex items-center gap-3 rounded-md border border-[#27272A] bg-[#09090B] px-3 py-2">
          <Globe className="h-4 w-4 text-[#94A3B8]" />
          <span className="text-sm font-medium text-[#94A3B8] w-24">Workspace ID</span>
          <input
            type="text"
            readOnly
            value={`ws_${workspaceId || ''}`}
            className="flex-1 bg-transparent text-sm text-[#94A3B8] focus:outline-none"
          />
          <button 
            onClick={() => navigator.clipboard.writeText(`ws_${workspaceId || ''}`)}
            className="text-[#94A3B8] hover:text-[#E2E8F0] transition-colors"
            title="Copy ID"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex justify-end gap-3 pt-4">
          {!isEditing ? (
            isAdmin && (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 rounded-md bg-[#27272A] px-4 py-2 text-sm font-medium text-[#E2E8F0] transition-colors hover:bg-[#3F3F46]"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            )
          ) : (
            <>
              <button 
                onClick={handleCancel}
                disabled={isSaving}
                className="rounded-md border border-[#27272A] bg-transparent px-4 py-2 text-sm font-medium text-[#E2E8F0] transition-colors hover:bg-[#27272A] cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}