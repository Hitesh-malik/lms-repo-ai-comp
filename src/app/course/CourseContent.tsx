"use client";

import { useSearchParams } from "next/navigation";
import { useCourseContentAdminQuery } from "@/hooks/useCourseQueries";
import CommonModal from "@/components/Common/modal";
import AddModuleForm from "@/components/Form/AddModuleForm";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Lesson, Module } from "@/services/courseApi";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { ChevronDown, ChevronRight, Settings, RotateCcw } from "lucide-react";

export default function CourseContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";

  const [addModuleOpen, setAddModuleOpen] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const { data, isLoading, isError, error, refetch } = useCourseContentAdminQuery(slug);

  const course = data?.course;
  const modules = (data?.modules ?? []).sort((a, b) => a.order_index - b.order_index);

  const toggleModule = (id: string) => {
    setExpandedModuleId((prev) => (prev === id ? null : id));
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
                      isExpanded={expandedModuleId === mod.id}
                      selectedLessonId={selectedLesson?.id ?? null}
                      onToggle={() => toggleModule(mod.id)}
                      onSelectLesson={setSelectedLesson}
                    />
                  ))}
                </ul>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75} minSize={50}>
              <div className="h-full overflow-y-auto p-6 bg-white">
                {selectedLesson ? (
                  <LessonContent lesson={selectedLesson} />
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
    </main>
  );
}

function ModuleAccordionItem({
  module: mod,
  isExpanded,
  selectedLessonId,
  onToggle,
  onSelectLesson,
}: {
  module: Module;
  isExpanded: boolean;
  selectedLessonId: string | null;
  onToggle: () => void;
  onSelectLesson: (lesson: Lesson) => void;
}) {
  const lessons = (mod.lessons ?? []).sort((a, b) => a.order_index - b.order_index);

  return (
    <li className="rounded-lg border border-slate-200 bg-white overflow-hidden">
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
        <span className="shrink-0 text-xs text-slate-400">
          {lessons.length} {lessons.length === 1 ? "Lesson" : "Lessons"}
        </span>
      </button>
      {isExpanded && (
        <ul className="border-t border-slate-100 bg-slate-50/50 py-1">
          {lessons.length === 0 ? (
            <li className="px-3 py-4 pl-11 text-xs text-slate-500">No lessons in this module.</li>
          ) : (
            lessons.map((lesson) => (
              <li key={lesson.id}>
                <button
                  type="button"
                  onClick={() => onSelectLesson(lesson)}
                  className={`block w-full px-3 py-2 pl-11 text-left text-sm transition-colors hover:bg-slate-100 ${
                    selectedLessonId === lesson.id
                      ? "bg-blue-50 text-blue-800 font-medium"
                      : "text-slate-700"
                  }`}
                >
                  <span className="block truncate">{lesson.title}</span>
                  {lesson.order_index != null && (
                    <span className="text-xs text-slate-400 mt-0.5 block">
                      {lesson.content_type} · {lesson.is_published ? "Published" : "Draft"}
                    </span>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </li>
  );
}

function LessonContent({ lesson }: { lesson: Lesson }) {
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
      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50/50 p-6 text-center">
        {lesson.content_uploaded ? (
          <p className="text-sm text-slate-600">
            Content ready ({lesson.content_type}). Player or viewer would render here.
          </p>
        ) : (
          <p className="text-sm text-slate-500">No content uploaded for this lesson yet.</p>
        )}
      </div>
    </article>
  );
}
