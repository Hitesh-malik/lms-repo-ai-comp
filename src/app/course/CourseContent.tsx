"use client";

import { useSearchParams } from "next/navigation";
import { useCourseContentAdminQuery, useLessonAdminQuery } from "@/hooks/useCourseQueries";
import CommonModal from "@/components/Common/modal";
import AddModuleForm from "@/components/Form/AddModuleForm";
import AddLessonForm from "@/components/Form/AddLessonForm";
import EditLessonForm from "@/components/Form/EditLessonForm";
import EditModuleForm from "@/components/Form/EditModuleForm";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { deleteLessonVideoApi, Lesson, LessonAdmin, Module } from "@/services/courseApi";
import { useState, useCallback } from "react";
import { FiPlus } from "react-icons/fi";
import { ChevronDown, ChevronRight, Settings, RotateCcw, PlayCircle, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { useDeleteLessonMutation, useDeleteModuleMutation } from "@/hooks/useCourseMutations";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/utils";
import { FileUpload } from "@/components/ui/file-upload";
import { VideoUploader } from "@/components/ui/VideoUploader";

export default function CourseContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";

  const [addModuleOpen, setAddModuleOpen] = useState(false);
  const [addLessonOpen, setAddLessonOpen] = useState(false);
  const [addLessonModule, setAddLessonModule] = useState<{ id: string; title: string } | null>(null);
  const [editLessonOpen, setEditLessonOpen] = useState(false);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [editModuleOpen, setEditModuleOpen] = useState(false);
  const [moduleToEdit, setModuleToEdit] = useState<Module | null>(null);
  const [deleteLessonConfirmOpen, setDeleteLessonConfirmOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
  const [deleteModuleConfirmOpen, setDeleteModuleConfirmOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null);
  const [deleteLessonConfirmInput, setDeleteLessonConfirmInput] = useState("");
  const [deleteModuleConfirmInput, setDeleteModuleConfirmInput] = useState("");
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const { data, isLoading, isError, error, refetch } = useCourseContentAdminQuery(slug);
  const lessonAdminQuery = useLessonAdminQuery(selectedLesson?.id ?? null);
  const deleteLessonMutation = useDeleteLessonMutation(slug);
  const deleteModuleMutation = useDeleteModuleMutation(slug);

  const displayLesson: LessonAdmin | null = selectedLesson
    ? (lessonAdminQuery.data?.lesson ?? selectedLesson)
    : null;

  const course = data?.course;
  const modules = (data?.modules ?? []).sort((a, b) => a.order_index - b.order_index);

  const toggleModule = (id: string) => {
    setExpandedModuleId((prev) => (prev === id ? null : id));
  };

  const handleDeleteModuleConfirm = async () => {
    if (!moduleToDelete?.id) return;
    try {
      await deleteModuleMutation.mutateAsync(moduleToDelete.id);
      toast.success("Module deleted.");
      if (expandedModuleId === moduleToDelete.id) setExpandedModuleId(null);
      if (selectedLesson && moduleToDelete.lessons?.some((l) => l.id === selectedLesson.id))
        setSelectedLesson(null);
      setDeleteModuleConfirmOpen(false);
      setModuleToDelete(null);
      setDeleteModuleConfirmInput("");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to delete module"));
    }
  };

  const handleDeleteLessonConfirm = async () => {
    if (!lessonToDelete?.id) return;
    try {
      await deleteLessonMutation.mutateAsync(lessonToDelete.id);
      toast.success("Lesson deleted.");
      if (selectedLesson?.id === lessonToDelete.id) setSelectedLesson(null);
      setDeleteLessonConfirmOpen(false);
      setLessonToDelete(null);
      setDeleteLessonConfirmInput("");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to delete lesson"));
    }
  };

  if (!slug) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <h1 className="text-2xl font-semibold text-slate-900">View Course</h1>
          <p className="mt-2 text-slate-600">
            Add <code className="rounded bg-slate-100 px-1.5 py-0.5">?slug=...</code> to the URL to view a course.
          </p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <p className="text-slate-600">Loading course…</p>
        </div>
      </main>
    );
  }

  if (isError || !course) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <p>Failed to load course.</p>
            <p className="mt-1 text-sm opacity-90">{(error as Error)?.message}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Header: title + status + actions */}
      <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  course.is_published ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {course.is_published ? "Published" : "Unpublished"}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 truncate">{course.title}</h1>
            <p className="mt-1 text-slate-600 text-sm line-clamp-2">{course.description ?? ""}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              aria-label="Reorder"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reorder</span>
            </button>
            <button
              type="button"
              onClick={() => setAddModuleOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FiPlus className="w-4 h-4" />
              Add Module
            </button>
          </div>
        </div>
      </div>

      {/* Resizable two-panel layout */}
      <div className="flex-1 min-h-0 px-6 py-4">
        {modules.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-16 text-center h-[400px]"
            role="region"
            aria-label="No modules"
          >
            <p className="text-slate-600 font-medium">No modules yet.</p>
            <p className="mt-1 text-sm text-slate-500">Add a module to structure your course content.</p>
            <button
              type="button"
              onClick={() => setAddModuleOpen(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              <FiPlus className="w-4 h-4" />
              Add Module
            </button>
          </div>
        ) : (
          <ResizablePanelGroup
            direction="horizontal"
            className="rounded-lg border border-slate-200 min-h-[calc(100vh-12rem)]"
          >
            <ResizablePanel defaultSize={25} minSize={20} maxSize={45}>
              <div className="h-full overflow-y-auto p-3 bg-slate-50/50">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 px-2">
                  Modules
                </p>
                <ul className="space-y-0.5">
                  {modules.map((mod) => (
                    <ModuleAccordionItem
                      key={mod.id}
                      module={mod}
                      slug={slug}
                      isExpanded={expandedModuleId === mod.id}
                      selectedLessonId={selectedLesson?.id ?? null}
                      onToggle={() => toggleModule(mod.id)}
                      onSelectLesson={setSelectedLesson}
                      onAddLesson={(moduleId, moduleTitle) => {
                        setAddLessonModule({ id: moduleId, title: moduleTitle });
                        setAddLessonOpen(true);
                      }}
                      onEditLesson={(lesson) => {
                        setEditLesson(lesson);
                        setEditLessonOpen(true);
                      }}
                      onDeleteLesson={(lesson) => {
                        setLessonToDelete(lesson);
                        setDeleteLessonConfirmOpen(true);
                      }}
                      onEditModule={(module) => {
                        setModuleToEdit(module);
                        setEditModuleOpen(true);
                      }}
                      onDeleteModule={(module) => {
                        setModuleToDelete(module);
                        setDeleteModuleConfirmOpen(true);
                      }}
                    />
                  ))}
                </ul>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75} minSize={50}>
              <div className="h-full overflow-y-auto p-6 bg-white">
                {selectedLesson ? (
                  lessonAdminQuery.isLoading && !lessonAdminQuery.data ? (
                    <div className="flex min-h-[200px] items-center justify-center text-slate-500">
                      <p className="text-sm">Loading lesson…</p>
                    </div>
                  ) : (
                    <LessonContent
                      lesson={displayLesson ?? selectedLesson}
                      onLessonContentUpdated={() => lessonAdminQuery.refetch()}
                    />
                  )
                ) : (
                  <div className="flex h-full min-h-[320px] items-center justify-center text-slate-500">
                    <p className="text-center text-sm">Select a lesson from the left to view its content.</p>
                  </div>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>

      <CommonModal isOpen={addModuleOpen} setIsOpen={setAddModuleOpen}>
        <AddModuleForm
          slug={slug}
          nextOrderIndex={modules.length + 1}
          onClose={() => setAddModuleOpen(false)}
        />
      </CommonModal>

      {addLessonModule && (
        <CommonModal isOpen={addLessonOpen} setIsOpen={setAddLessonOpen}>
          <AddLessonForm
            slug={slug}
            moduleId={addLessonModule.id}
            moduleTitle={addLessonModule.title}
            nextOrderIndex={
              (modules.find((m) => m.id === addLessonModule.id)?.lessons?.length ?? 0) + 1
            }
            onClose={() => {
              setAddLessonOpen(false);
              setAddLessonModule(null);
            }}
          />
        </CommonModal>
      )}

      {editLesson && (
        <CommonModal
          isOpen={editLessonOpen}
          setIsOpen={(open) => {
            setEditLessonOpen(open);
            if (!open) setEditLesson(null);
          }}
        >
          <EditLessonForm
            slug={slug}
            lesson={editLesson}
            onClose={() => {
              setEditLessonOpen(false);
              setEditLesson(null);
            }}
          />
        </CommonModal>
      )}

      {moduleToEdit && (
        <CommonModal
          isOpen={editModuleOpen}
          setIsOpen={(open) => {
            setEditModuleOpen(open);
            if (!open) setModuleToEdit(null);
          }}
        >
          <EditModuleForm
            slug={slug}
            module={moduleToEdit}
            onClose={() => {
              setEditModuleOpen(false);
              setModuleToEdit(null);
            }}
          />
        </CommonModal>
      )}

      <CommonModal
        isOpen={deleteLessonConfirmOpen}
        setIsOpen={(open) => {
          setDeleteLessonConfirmOpen(open);
          if (!open) {
            setLessonToDelete(null);
            setDeleteLessonConfirmInput("");
          }
        }}
      >
        <div className="flex flex-col gap-5 py-2">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 rounded-full bg-red-100 ring-4 ring-red-50">
              <AlertTriangle className="w-7 h-7 text-red-600" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-semibold text-slate-900">Delete lesson</h3>
              <p className="text-slate-600 mt-1">
                Are you sure you want to delete this lesson? This cannot be undone.
              </p>
            </div>
          </div>
          {lessonToDelete && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
                Lesson to remove
              </p>
              <p className="font-semibold text-slate-900">{lessonToDelete.title}</p>
              <p className="text-sm text-slate-600 mt-0.5">{lessonToDelete.content_type}</p>
            </div>
          )}
          {lessonToDelete && (
            <div>
              <label htmlFor="delete-lesson-confirm" className="block text-sm font-medium text-slate-700 mb-1.5">
                Type <span className="font-semibold text-slate-900">{lessonToDelete.title}</span> to confirm
              </label>
              <input
                id="delete-lesson-confirm"
                type="text"
                value={deleteLessonConfirmInput}
                onChange={(e) => setDeleteLessonConfirmInput(e.target.value)}
                placeholder={`Enter "${lessonToDelete.title}"`}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoComplete="off"
              />
            </div>
          )}
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setDeleteLessonConfirmOpen(false);
                setLessonToDelete(null);
                setDeleteLessonConfirmInput("");
              }}
              disabled={deleteLessonMutation.isPending}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteLessonConfirm}
              disabled={deleteLessonMutation.isPending || deleteLessonConfirmInput.trim() !== lessonToDelete?.title}
              className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition-colors font-medium flex items-center justify-center gap-2 min-w-[130px]"
            >
              {deleteLessonMutation.isPending ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" aria-hidden />
                  Delete lesson
                </>
              )}
            </button>
          </div>
        </div>
      </CommonModal>

      <CommonModal
        isOpen={deleteModuleConfirmOpen}
        setIsOpen={(open) => {
          setDeleteModuleConfirmOpen(open);
          if (!open) {
            setModuleToDelete(null);
            setDeleteModuleConfirmInput("");
          }
        }}
      >
        <div className="flex flex-col gap-5 py-2">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 rounded-full bg-red-100 ring-4 ring-red-50">
              <AlertTriangle className="w-7 h-7 text-red-600" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-semibold text-slate-900">Delete module</h3>
              <p className="text-slate-600 mt-1">
                Are you sure you want to delete this module? All lessons in it will be removed. This cannot be undone.
              </p>
            </div>
          </div>
          {moduleToDelete && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
                Module to remove
              </p>
              <p className="font-semibold text-slate-900">{moduleToDelete.title}</p>
              <p className="text-sm text-slate-600 mt-0.5">
                {(moduleToDelete.lessons ?? []).length} lesson(s)
              </p>
            </div>
          )}
          {moduleToDelete && (
            <div>
              <label htmlFor="delete-module-confirm" className="block text-sm font-medium text-slate-700 mb-1.5">
                Type <span className="font-semibold text-slate-900">{moduleToDelete.title}</span> to confirm
              </label>
              <input
                id="delete-module-confirm"
                type="text"
                value={deleteModuleConfirmInput}
                onChange={(e) => setDeleteModuleConfirmInput(e.target.value)}
                placeholder={`Enter "${moduleToDelete.title}"`}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoComplete="off"
              />
            </div>
          )}
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setDeleteModuleConfirmOpen(false);
                setModuleToDelete(null);
                setDeleteModuleConfirmInput("");
              }}
              disabled={deleteModuleMutation.isPending}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteModuleConfirm}
              disabled={deleteModuleMutation.isPending || deleteModuleConfirmInput.trim() !== moduleToDelete?.title}
              className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition-colors font-medium flex items-center justify-center gap-2 min-w-[130px]"
            >
              {deleteModuleMutation.isPending ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" aria-hidden />
                  Delete module
                </>
              )}
            </button>
          </div>
        </div>
      </CommonModal>
    </main>
  );
}

function ModuleAccordionItem({
  module: mod,
  slug,
  isExpanded,
  selectedLessonId,
  onToggle,
  onSelectLesson,
  onAddLesson,
  onEditModule,
  onDeleteModule,
  onEditLesson,
  onDeleteLesson,
}: {
  module: Module;
  slug: string;
  isExpanded: boolean;
  selectedLessonId: string | null;
  onToggle: () => void;
  onSelectLesson: (lesson: Lesson) => void;
  onAddLesson: (moduleId: string, moduleTitle: string) => void;
  onEditModule: (module: Module) => void;
  onDeleteModule: (module: Module) => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (lesson: Lesson) => void;
}) {
  const lessons = (mod.lessons ?? []).sort((a, b) => a.order_index - b.order_index);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li
      className="rounded-lg border border-slate-200 bg-white overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
          )}
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-100 text-xs font-semibold text-slate-700">
            {mod.order_index}
          </span>
          <span className="min-w-0 flex-1 truncate">{mod.title}</span>
          <span
            className={`shrink-0 text-xs font-medium ${
              mod.is_published ? "text-green-600" : "text-slate-500"
            }`}
          >
            {mod.is_published ? "Published" : "Draft"}
          </span>
          <span className="shrink-0 text-xs text-slate-400">
            {lessons.length} {lessons.length === 1 ? "Lesson" : "Lessons"}
          </span>
        </button>
        {isHovered && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditModule(mod);
              }}
              className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              aria-label="Edit module"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteModule(mod);
              }}
              className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 transition-colors"
              aria-label="Delete module"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddLesson(mod.id, mod.title);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <FiPlus className="w-3 h-3" />
              Add Lesson
            </button>
          </div>
        )}
      </div>
      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/50">
          {lessons.length === 0 ? (
            <div className="px-3 py-4 pl-11 text-xs text-slate-500">
              No lessons in this module.
            </div>
          ) : (
            <ul className="py-1">
              {lessons.map((lesson) => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  isSelected={selectedLessonId === lesson.id}
                  onSelect={() => onSelectLesson(lesson)}
                  onEdit={() => onEditLesson(lesson)}
                  onDelete={() => onDeleteLesson(lesson)}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
}

function LessonRow({
  lesson,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: {
  lesson: Lesson;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li
      className="group/lesson relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        onClick={onSelect}
        className={`relative flex w-full items-start gap-3 px-3 py-3 pl-11 text-left transition-colors hover:bg-slate-100 ${
          isSelected ? "bg-blue-50 text-blue-900" : "text-slate-700"
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <PlayCircle
              className={`h-4 w-4 shrink-0 ${
                isSelected ? "text-blue-600" : "text-slate-400"
              }`}
            />
            <span
              className={`font-medium text-sm truncate ${
                isSelected ? "text-blue-900" : "text-slate-900"
              }`}
            >
              {lesson.title}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap ml-6">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                lesson.content_type === "video"
                  ? "bg-purple-100 text-purple-700"
                  : lesson.content_type === "quiz"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {lesson.content_type}
            </span>
            <span
              className={`text-xs ${
                lesson.is_published ? "text-green-600 font-medium" : "text-slate-500"
              }`}
            >
              {lesson.is_published ? "Published" : "Draft"}
            </span>
            {lesson.is_free_preview && (
              <span className="text-xs text-blue-600 font-medium">Free Preview</span>
            )}
          </div>
          {lesson.description && (
            <p className="text-xs text-slate-600 mt-1.5 ml-6 line-clamp-2">
              {lesson.description}
            </p>
          )}
        </div>
        {isHovered && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              aria-label="Edit lesson"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 transition-colors"
              aria-label="Delete lesson"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </button>
    </li>
  );
}

function LessonContent({
  lesson,
  onLessonContentUpdated,
}: {
  lesson: LessonAdmin;
  onLessonContentUpdated?: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const hasContentUrl = !!lesson.content_url?.trim();

  const handleDeleteVideo = useCallback(async () => {
    if (!lesson.id || deleting) return;
    setDeleting(true);
    try {
      await deleteLessonVideoApi(lesson.id);
      toast.success("Video deleted.");
      onLessonContentUpdated?.();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to delete video"));
    } finally {
      setDeleting(false);
    }
  }, [lesson.id, deleting, onLessonContentUpdated]);

  return (
    <article className="prose prose-slate max-w-none">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-700">
          {lesson.content_type}
        </span>
        <span
          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
            lesson.is_published ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
          }`}
        >
          {lesson.is_published ? "Published" : "Draft"}
        </span>
        {lesson.is_free_preview && (
          <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
            Free preview
          </span>
        )}
      </div>
      <h2 className="text-xl font-bold text-slate-900 mt-0">{lesson.title}</h2>
      {lesson.description && (
        <p className="text-slate-600 text-sm leading-relaxed">{lesson.description}</p>
      )}
      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50/50 p-6">
        {hasContentUrl ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="aspect-video w-full max-w-5xl min-h-[28rem] overflow-hidden rounded-md flex-1 min-w-0">
                <iframe
                  src={lesson.content_url!}
                  title={lesson.title}
                  className="h-full w-full min-h-[28rem]"
                  allow="autoplay; fullscreen"
                />
              </div>
              <button
                type="button"
                onClick={handleDeleteVideo}
                disabled={deleting}
                className="shrink-0 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 transition-colors"
                aria-label="Delete video"
              >
                {deleting ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                {deleting ? "Deleting…" : "Delete video"}
              </button>
            </div>
          </>
        ) : lesson.content_uploaded ? (
          <div className="flex flex-wrap items-center justify-center gap-4">
            <p className="text-sm text-slate-600">
              Content ready ({lesson.content_type}). Player or viewer would render here.
            </p>
            {lesson.content_type === "video" && (
              <button
                type="button"
                onClick={handleDeleteVideo}
                disabled={deleting}
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 transition-colors"
                aria-label="Delete video"
              >
                {deleting ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                {deleting ? "Deleting…" : "Delete video"}
              </button>
            )}
          </div>
        ) : lesson.content_type === "video" ? (
          <VideoUploader
            lessonId={lesson.id}
            onSuccess={() => {
              toast.success("Video uploaded successfully.");
              onLessonContentUpdated?.();
            }}
          />
        ) : (
          <FileUpload
            accept={
              lesson.content_type === "quiz"
                ? { "application/pdf": [] }
                : { "application/pdf": [], "video/mp4": [], "video/webm": [] }
            }
            onChange={(files) => {
              if (files.length > 0) {
                toast.success(`Selected: ${files[0].name}`);
              }
            }}
          />
        )}
      </div>
    </article>
  );
}
