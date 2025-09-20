// src/hooks/useProjectSave.ts
import { useState, useRef } from "react";
import isEqual from "lodash/isEqual";

type SaveStatus = "idle" | "saving" | "success" | "error";

interface UseProjectSaveOptions<T> {
  templateId: number;
  buildProps: () => T;
  videoEndpoint: string;
  filterRenderProps?: (props: T) => Partial<T>; // 👈 NEW
}

export function useProjectSave<T>({
  templateId,
  buildProps,
  videoEndpoint,
  filterRenderProps, // 👈 NEW
}: UseProjectSaveOptions<T>) {
  const [projectId, setProjectId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const lastSavedProps = useRef<T | null>(null);

  const handleSave = async () => {
    const currentProps = buildProps();
    const renderProps = filterRenderProps ? filterRenderProps(currentProps) : currentProps;

    if (projectId) {
      if (lastSavedProps.current && isEqual(lastSavedProps.current, currentProps)) {
        alert("✅ Your project has already been saved");
        return;
      }

      setIsSaving(true);
      setSaveStatus("saving");
      try {
        // 🔹 Render API only gets the filtered props
        const exportRes = await fetch(videoEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...renderProps,
            format: "mp4",
          }),
        });

        if (!exportRes.ok) throw new Error(await exportRes.text());
        const exportResult = await exportRes.json();
        const projectVidUrl = exportResult.url;

        // 🔹 DB still stores the full props
        const response = await fetch(`/projects/update/${projectId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            props: currentProps,
            projectVidUrl,
          }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error ?? (await response.text()));
        }

        const result = await response.json();
        lastSavedProps.current = currentProps;
        setProjectId(result.project.id);
        localStorage.setItem("projectId", result.project.id.toString());

        setSaveStatus("success");
        alert("✅ Project updated successfully!");
      } catch (err: any) {
        console.error(err);
        setSaveStatus("error");
        alert(`❌ Save failed: ${err?.message ?? err}`);
      } finally {
        setIsSaving(false);
      }
    } else {
      setShowSaveModal(true);
    }
  };

  // --- Save new project
  const saveNewProject = async (
    titleFromModal: string,
    setStatus: (s: string) => void
  ) => {
    try {
      setStatus("Saving project...");
      const currentProps = buildProps();
      const renderProps = filterRenderProps ? filterRenderProps(currentProps) : currentProps;

      const exportRes = await fetch(videoEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...renderProps,
          format: "mp4",
        }),
      });

      if (!exportRes.ok) throw new Error(await exportRes.text());
      const exportResult = await exportRes.json();
      const projectVidUrl = exportResult.url;

      const response = await fetch("/projects/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: titleFromModal,
          templateId,
          props: currentProps, // save full props
          projectVidUrl,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? (await response.text()));
      }

      const result = await response.json();
      setProjectId(result.project.id);
      lastSavedProps.current = currentProps;
      localStorage.setItem("projectId", result.project.id.toString());

      setStatus("Saved!");
    } catch (err) {
      console.error("saveNewProject error", err);
      throw err;
    }
  };

  return {
    projectId,
    setProjectId,
    isSaving,
    saveStatus,
    showSaveModal,
    setShowSaveModal,
    handleSave,
    saveNewProject,
    lastSavedProps,
  };
}
