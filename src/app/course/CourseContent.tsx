"use client";

import { useSearchParams } from "next/navigation";
import { useCourseContentAdminQuery, useLessonAdminQuery, useQuizAdminQuery, useQuizQuestionsQuery } from "@/hooks/useCourseQueries";
import CommonModal from "@/components/Common/modal";
import AddModuleForm from "@/components/Form/AddModuleForm";
import AddLessonForm from "@/components/Form/AddLessonForm";
import EditLessonForm from "@/components/Form/EditLessonForm";
import EditModuleForm from "@/components/Form/EditModuleForm";
import CreateQuizForm from "@/components/Form/CreateQuizForm";
import AddQuestionForm from "@/components/Form/AddQuestionForm";
import EditQuestionForm from "@/components/Form/EditQuestionForm";
import EditQuizForm from "@/components/Form/EditQuizForm";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { deleteLessonVideoApi, Lesson, LessonAdmin, Module, Quiz, QuizQuestion } from "@/services/courseApi";
import { useState, useCallback, useEffect, useRef } from "react";
import { FiPlus } from "react-icons/fi";
import { ChevronDown, ChevronRight, Settings, RotateCcw, PlayCircle, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { useDeleteLessonMutation, useDeleteModuleMutation, useDeleteQuizQuestionMutation, useUpdateQuizMutation, useDeleteQuizMutation } from "@/hooks/useCourseMutations";
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
  const [createQuizOpen, setCreateQuizOpen] = useState(false);
  const [addQuestionOpen, setAddQuestionOpen] = useState(false);
  const [editQuestionOpen, setEditQuestionOpen] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<QuizQuestion | null>(null);
  const [deleteQuestionConfirmOpen, setDeleteQuestionConfirmOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<QuizQuestion | null>(null);
  const [editQuizOpen, setEditQuizOpen] = useState(false);
  const [quizToEdit, setQuizToEdit] = useState<Quiz | null>(null);
  const [deleteQuizConfirmOpen, setDeleteQuizConfirmOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
  const [deleteQuizConfirmInput, setDeleteQuizConfirmInput] = useState("");
  const [createdQuizIdByLesson, setCreatedQuizIdByLesson] = useState<Record<string, string>>({});

  const { data, isLoading, isError, error, refetch } = useCourseContentAdminQuery(slug);
  const course = data?.course;
  const modules = (data?.modules ?? []).sort((a, b) => a.order_index - b.order_index);

  const isVideo = selectedLesson?.content_type === "video";
  const isQuiz = selectedLesson?.content_type === "quiz";
  const selectedQuizId =
    selectedLesson && isQuiz
      ? selectedLesson.quiz_id ?? selectedLesson.content_id ?? createdQuizIdByLesson[selectedLesson.id] ?? null
      : null;

  const lessonAdminQuery = useLessonAdminQuery(
    isVideo && selectedLesson?.id ? selectedLesson.id : null
  );
  const quizAdminQuery = useQuizAdminQuery(selectedQuizId);
  const quizQuestionsQuery = useQuizQuestionsQuery(selectedQuizId);

  const displayLesson: LessonAdmin | null = selectedLesson
    ? isVideo
      ? (lessonAdminQuery.data?.lesson ?? selectedLesson)
      : selectedLesson
    : null;

  const deleteLessonMutation = useDeleteLessonMutation(slug);
  const deleteModuleMutation = useDeleteModuleMutation(slug);
  const deleteQuizQuestionMutation = useDeleteQuizQuestionMutation(selectedQuizId ?? "");
  const deleteQuizMutation = useDeleteQuizMutation(selectedQuizId ?? "");

  const allLessons = modules.flatMap((m) => m.lessons ?? []);

  const hasAppliedInitialHash = useRef(false);
  const prevSlug = useRef(slug);
  if (prevSlug.current !== slug) {
    prevSlug.current = slug;
    hasAppliedInitialHash.current = false;
  }
  useEffect(() => {
    if (!slug || modules.length === 0 || hasAppliedInitialHash.current) return;
    const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    if (!hash) return;
    const lessonMatch = /^lesson-(.+)$/.exec(hash);
    const quizMatch = /^quiz-(.+)$/.exec(hash);
    if (lessonMatch) {
      const lesson = allLessons.find((l) => l.id === lessonMatch[1]) ?? null;
      if (lesson) {
        setSelectedLesson(lesson);
        setExpandedModuleId(lesson.module_id);
        hasAppliedInitialHash.current = true;
      }
    } else if (quizMatch) {
      const lesson =
        allLessons.find(
          (l) =>
            l.content_type === "quiz" &&
            (l.quiz_id === quizMatch[1] || l.content_id === quizMatch[1])
        ) ?? null;
      if (lesson) {
        setSelectedLesson(lesson);
        setExpandedModuleId(lesson.module_id);
        hasAppliedInitialHash.current = true;
      }
    }
  }, [slug, modules.length, allLessons]);

  const handleSelectLesson = useCallback(
    (lesson: Lesson) => {
      setSelectedLesson(lesson);
      const quizId =
        lesson.content_type === "quiz"
          ? lesson.quiz_id ?? lesson.content_id ?? createdQuizIdByLesson[lesson.id] ?? null
          : null;
      const newHash =
        lesson.content_type === "video" || (lesson.content_type === "quiz" && !quizId)
          ? `lesson-${lesson.id}`
          : `quiz-${quizId}`;
      if (typeof window !== "undefined") window.location.hash = newHash;
    },
    [createdQuizIdByLesson]
  );

  useEffect(() => {
    if (!selectedLesson) return;
    const quizId =
      selectedLesson.content_type === "quiz"
        ? selectedLesson.quiz_id ?? selectedLesson.content_id ?? createdQuizIdByLesson[selectedLesson.id] ?? null
        : null;
    const newHash =
      selectedLesson.content_type === "video" ||
      (selectedLesson.content_type === "quiz" && !quizId)
        ? `lesson-${selectedLesson.id}`
        : `quiz-${quizId}`;
    if (typeof window !== "undefined" && window.location.hash.slice(1) !== newHash)
      window.location.hash = newHash;
  }, [selectedLesson, createdQuizIdByLesson]);

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
                      onSelectLesson={handleSelectLesson}
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
                  (isVideo && lessonAdminQuery.isLoading && !lessonAdminQuery.data) ||
                  (isQuiz && selectedQuizId && quizAdminQuery.isLoading && !quizAdminQuery.data) ? (
                    <div className="flex min-h-[200px] items-center justify-center text-slate-500">
                      <p className="text-sm">Loading…</p>
                    </div>
                  ) : (
                    <LessonContent
                      lesson={displayLesson ?? selectedLesson}
                      quiz={isQuiz && selectedQuizId ? quizAdminQuery.data ?? null : null}
                      questions={isQuiz && selectedQuizId ? quizQuestionsQuery.data?.questions ?? [] : []}
                      onLessonContentUpdated={() => {
                        lessonAdminQuery.refetch();
                        refetch();
                      }}
                      onQuestionsUpdated={() => quizQuestionsQuery.refetch()}
                      createdQuizId={
                        selectedLesson
                          ? createdQuizIdByLesson[selectedLesson.id] ?? null
                          : null
                      }
                      onCreateQuizClick={() => setCreateQuizOpen(true)}
                      onAddQuestionClick={() => setAddQuestionOpen(true)}
                      onEditQuestion={(q) => {
                        setQuestionToEdit(q);
                        setEditQuestionOpen(true);
                      }}
                      onDeleteQuestion={(q) => {
                        setQuestionToDelete(q);
                        setDeleteQuestionConfirmOpen(true);
                      }}
                      onEditQuiz={(quiz) => {
                        setQuizToEdit(quiz);
                        setEditQuizOpen(true);
                      }}
                      onDeleteQuiz={(quiz) => {
                        setQuizToDelete(quiz);
                        setDeleteQuizConfirmInput("");
                        setDeleteQuizConfirmOpen(true);
                      }}
                      quizId={selectedQuizId}
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

      {createQuizOpen && selectedLesson && (
        <CommonModal isOpen={createQuizOpen} setIsOpen={setCreateQuizOpen}>
          <CreateQuizForm
            lessonId={selectedLesson.id}
            lessonTitle={selectedLesson.title}
            slug={slug}
            onSuccess={(quizId) => {
              setCreatedQuizIdByLesson((prev) => ({
                ...prev,
                [selectedLesson.id]: quizId,
              }));
              refetch();
              if (typeof window !== "undefined") window.location.hash = `quiz-${quizId}`;
            }}
            onClose={() => setCreateQuizOpen(false)}
          />
        </CommonModal>
      )}

      {addQuestionOpen && selectedLesson && (() => {
        const quizIdForAdd =
          selectedLesson.quiz_id ?? selectedLesson.content_id ?? createdQuizIdByLesson[selectedLesson.id];
        return quizIdForAdd ? (
          <CommonModal isOpen={addQuestionOpen} setIsOpen={setAddQuestionOpen}>
            <AddQuestionForm
              quizId={quizIdForAdd}
              onSuccess={() => {
                setAddQuestionOpen(false);
                quizQuestionsQuery.refetch();
              }}
              onClose={() => setAddQuestionOpen(false)}
            />
          </CommonModal>
        ) : null;
      })()}

      {editQuestionOpen && questionToEdit && selectedQuizId && (
        <CommonModal
          isOpen={editQuestionOpen}
          setIsOpen={(open) => {
            setEditQuestionOpen(open);
            if (!open) setQuestionToEdit(null);
          }}
        >
          <EditQuestionForm
            question={questionToEdit}
            quizId={selectedQuizId}
            onSuccess={() => quizQuestionsQuery.refetch()}
            onClose={() => {
              setEditQuestionOpen(false);
              setQuestionToEdit(null);
            }}
          />
        </CommonModal>
      )}

      {editQuizOpen && quizToEdit && (
        <CommonModal
          isOpen={editQuizOpen}
          setIsOpen={(open) => {
            setEditQuizOpen(open);
            if (!open) setQuizToEdit(null);
          }}
        >
          <EditQuizForm
            quiz={quizToEdit}
            onSuccess={() => {
              quizAdminQuery.refetch();
              quizQuestionsQuery.refetch();
            }}
            onClose={() => {
              setEditQuizOpen(false);
              setQuizToEdit(null);
            }}
          />
        </CommonModal>
      )}

      <CommonModal
        isOpen={deleteQuizConfirmOpen}
        setIsOpen={(open) => {
          setDeleteQuizConfirmOpen(open);
          if (!open) {
            setQuizToDelete(null);
            setDeleteQuizConfirmInput("");
          }
        }}
      >
        <div className="flex flex-col gap-5 py-2">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 rounded-full bg-red-100 ring-4 ring-red-50">
              <AlertTriangle className="w-7 h-7 text-red-600" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-semibold text-slate-900">Delete quiz</h3>
              <p className="text-slate-600 mt-1">
                This will cascade delete all questions and attempts. This cannot be undone.
              </p>
            </div>
          </div>
          {quizToDelete && (
            <>
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
                  Quiz to remove
                </p>
                <p className="font-semibold text-slate-900">{quizToDelete.title}</p>
              </div>
              <div>
                <label htmlFor="delete-quiz-confirm" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Type <span className="font-semibold text-slate-900">{quizToDelete.title}</span> to confirm
                </label>
                <input
                  id="delete-quiz-confirm"
                  type="text"
                  value={deleteQuizConfirmInput}
                  onChange={(e) => setDeleteQuizConfirmInput(e.target.value)}
                  placeholder={`Enter "${quizToDelete.title}"`}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  autoComplete="off"
                />
              </div>
            </>
          )}
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setDeleteQuizConfirmOpen(false);
                setQuizToDelete(null);
                setDeleteQuizConfirmInput("");
              }}
              disabled={deleteQuizMutation.isPending}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!quizToDelete) return;
                try {
                  await deleteQuizMutation.mutateAsync();
                  toast.success("Quiz deleted.");
                  setDeleteQuizConfirmOpen(false);
                  setQuizToDelete(null);
                  setDeleteQuizConfirmInput("");
                  setSelectedLesson((prev) =>
                    prev ? { ...prev, quiz_id: null, content_id: null } : null
                  );
                  if (selectedLesson?.id) {
                    setCreatedQuizIdByLesson((prev) => {
                      const next = { ...prev };
                      delete next[selectedLesson.id];
                      return next;
                    });
                    if (typeof window !== "undefined") {
                      window.location.hash = `lesson-${selectedLesson.id}`;
                    }
                  }
                  refetch();
                } catch (err: unknown) {
                  toast.error(getApiErrorMessage(err, "Failed to delete quiz"));
                }
              }}
              disabled={
                deleteQuizMutation.isPending ||
                deleteQuizConfirmInput.trim() !== quizToDelete?.title
              }
              className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition-colors font-medium flex items-center justify-center gap-2 min-w-[130px]"
            >
              {deleteQuizMutation.isPending ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" aria-hidden />
                  Delete quiz
                </>
              )}
            </button>
          </div>
        </div>
      </CommonModal>

      <CommonModal
        isOpen={deleteQuestionConfirmOpen}
        setIsOpen={(open) => {
          setDeleteQuestionConfirmOpen(open);
          if (!open) setQuestionToDelete(null);
        }}
      >
        <div className="flex flex-col gap-5 py-2">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 rounded-full bg-red-100 ring-4 ring-red-50">
              <AlertTriangle className="w-7 h-7 text-red-600" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-semibold text-slate-900">Delete question</h3>
              <p className="text-slate-600 mt-1">
                Are you sure you want to delete this question? This cannot be undone.
              </p>
            </div>
          </div>
          {questionToDelete && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">
                Question to remove
              </p>
              <p className="font-medium text-slate-900 line-clamp-2">{questionToDelete.question_text}</p>
            </div>
          )}
          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setDeleteQuestionConfirmOpen(false);
                setQuestionToDelete(null);
              }}
              disabled={deleteQuizQuestionMutation.isPending}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!questionToDelete) return;
                try {
                  await deleteQuizQuestionMutation.mutateAsync(questionToDelete.id);
                  toast.success("Question deleted.");
                  setDeleteQuestionConfirmOpen(false);
                  setQuestionToDelete(null);
                } catch (err: unknown) {
                  toast.error(getApiErrorMessage(err, "Failed to delete question"));
                }
              }}
              disabled={deleteQuizQuestionMutation.isPending}
              className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition-colors font-medium flex items-center justify-center gap-2 min-w-[130px]"
            >
              {deleteQuizQuestionMutation.isPending ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" aria-hidden />
                  Delete question
                </>
              )}
            </button>
          </div>
        </div>
      </CommonModal>

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

function QuizQuestionsAccordion({
  questions,
  quizIdProp,
  onEditQuestion,
  onDeleteQuestion,
}: {
  questions: QuizQuestion[];
  quizIdProp: string | null;
  onEditQuestion?: (question: QuizQuestion) => void;
  onDeleteQuestion?: (question: QuizQuestion) => void;
}) {
  const sorted = [...questions].sort((a, b) => a.order_index - b.order_index);
  const [expandedId, setExpandedId] = useState<string | null>(sorted[0]?.id ?? null);

  return (
    <div className="w-full max-w-3xl text-left">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-700">
            Existing questions ({questions.length})
          </h3>
        </div>
        <ul className="divide-y divide-slate-100">
          {sorted.map((q, idx) => {
            const isExpanded = expandedId === q.id;
            return (
              <li key={q.id} className="bg-white">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : q.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-slate-50/80 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
                  )}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-100 text-xs font-semibold text-slate-700">
                    {idx + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900">
                    {q.question_text}
                  </span>
                </button>
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900">{q.question_text}</p>
                        <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                          <li>
                            <span className="font-medium text-slate-500">A.</span> {q.option_a}
                          </li>
                          <li>
                            <span className="font-medium text-slate-500">B.</span> {q.option_b}
                          </li>
                          <li>
                            <span className="font-medium text-slate-500">C.</span> {q.option_c}
                          </li>
                          <li>
                            <span className="font-medium text-slate-500">D.</span> {q.option_d}
                          </li>
                        </ul>
                        <p className="mt-2 text-xs text-slate-500">
                          Correct:{" "}
                          <span className="font-medium text-green-700">{q.correct_answer}</span>
                          {q.marks != null && <> · Marks: {q.marks}</>}
                          {q.negative_marks != null && q.negative_marks !== 0 && (
                            <> · Negative: {q.negative_marks}</>
                          )}
                          {q.difficulty_level && <> · {q.difficulty_level}</>}
                        </p>
                        {q.explanation && (
                          <p className="mt-1.5 text-xs text-slate-500 italic">
                            Explanation: {q.explanation}
                          </p>
                        )}
                      </div>
                      {quizIdProp && onEditQuestion && onDeleteQuestion && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => onEditQuestion(q)}
                            className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                            aria-label="Edit question"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteQuestion(q)}
                            className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 transition-colors"
                            aria-label="Delete question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function LessonContent({
  lesson,
  quiz = null,
  questions = [],
  onLessonContentUpdated,
  onQuestionsUpdated,
  createdQuizId = null,
  onCreateQuizClick,
  onAddQuestionClick,
  onEditQuestion,
  onDeleteQuestion,
  onEditQuiz,
  onDeleteQuiz,
  quizId: quizIdProp = null,
}: {
  lesson: LessonAdmin;
  quiz?: Quiz | null;
  questions?: QuizQuestion[];
  onLessonContentUpdated?: () => void;
  onQuestionsUpdated?: () => void;
  createdQuizId?: string | null;
  onCreateQuizClick?: () => void;
  onAddQuestionClick?: () => void;
  onEditQuestion?: (question: QuizQuestion) => void;
  onDeleteQuestion?: (question: QuizQuestion) => void;
  onEditQuiz?: (quiz: Quiz) => void;
  onDeleteQuiz?: (quiz: Quiz) => void;
  quizId?: string | null;
}) {
  const [deleting, setDeleting] = useState(false);
  const hasContentUrl = !!lesson.content_url?.trim();
  const quizId = lesson.quiz_id ?? lesson.content_id ?? createdQuizId ?? null;
  const isQuiz = lesson.content_type === "quiz";
  const hasQuiz = !!quizId;

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
        ) : lesson.content_uploaded && !isQuiz ? (
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
        ) : isQuiz ? (
          <div className="flex flex-col w-full max-w-3xl mx-auto gap-6 py-6">
            {!hasQuiz ? (
              <>
                <p className="text-sm text-slate-600 text-center max-w-md">
                  No quiz has been created for this lesson yet. Create a quiz to add questions.
                </p>
                <button
                  type="button"
                  onClick={onCreateQuizClick}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <FiPlus className="w-4 h-4" />
                  Create Quiz
                </button>
              </>
            ) : (
              <>
                {quiz && (
                  <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        Quiz details
                      </p>
                    </div>
                    <div className="p-4 text-left relative group">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold text-slate-900">{quiz.title}</h3>
                          {quiz.description && (
                            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                              {quiz.description}
                            </p>
                          )}
                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-500">
                            <span className="font-medium text-slate-600">Type:</span>
                            <span>{quiz.quiz_type}</span>
                            {quiz.time_limit_minutes != null && (
                              <>
                                <span className="font-medium text-slate-600">Time:</span>
                                <span>{quiz.time_limit_minutes} min</span>
                              </>
                            )}
                            <span className="font-medium text-slate-600">Pass:</span>
                            <span>{quiz.passing_percentage}%</span>
                            <span className="font-medium text-slate-600">Max attempts:</span>
                            <span>{quiz.max_attempts}</span>
                            <span
                              className={
                                quiz.is_published
                                  ? "text-green-600 font-medium"
                                  : "text-amber-600 font-medium"
                              }
                            >
                              {quiz.is_published ? "Published" : "Draft"}
                            </span>
                          </div>
                        </div>
                        {onEditQuiz && onDeleteQuiz && (
                          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => onEditQuiz(quiz)}
                              className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                              aria-label="Edit quiz"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteQuiz(quiz)}
                              className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 transition-colors"
                              aria-label="Delete quiz"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {questions.length > 0 && (
                  <QuizQuestionsAccordion
                    questions={questions}
                    quizIdProp={quizIdProp ?? null}
                    onEditQuestion={onEditQuestion}
                    onDeleteQuestion={onDeleteQuestion}
                  />
                )}
                <div className="flex flex-col items-center gap-2 pt-2">
                  <p className="text-sm text-slate-600 text-center">
                    {questions.length > 0
                      ? "Add more questions below."
                      : "Quiz is ready. Add multiple choice questions below."}
                  </p>
                  <button
                    type="button"
                    onClick={onAddQuestionClick}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Question
                  </button>
                </div>
              </>
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
            accept={{ "application/pdf": [], "video/mp4": [], "video/webm": [] }}
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
