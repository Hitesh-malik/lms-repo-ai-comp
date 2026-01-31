"use client";

import DataTable, { Column } from "@/components/Common/DataTable";
import CommonModal from "@/components/Common/modal";
import { SearchBar } from "@/components/Common/searchBar";
import { useCoursesAdminQuery } from "@/hooks/useCourseQueries";
import {
  useDeleteCourseMutation,
  useUpdateCourseThumbnailMutation,
  useDeleteCourseThumbnailMutation,
} from "@/hooks/useCourseMutations";
import {
  Course,
  getCourseThumbnailSignedUrlApi,
} from "@/services/courseApi";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import { Trash2, AlertTriangle, Loader2, UploadCloud, LayoutGrid, List } from "lucide-react";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/utils";
import { FileUpload } from "@/components/ui/file-upload";
import CourseForm from "@/components/Form/AddCourseForm";
import { SkeletonTable } from "@/components/ui/skeleton-table";

export default function CourseManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "card">("grid");

  const router = useRouter();
  const { data: courses, isLoading, isError, error, refetch } =
    useCoursesAdminQuery();
  const deleteCourseMutation = useDeleteCourseMutation();

  const courseRows: Course[] = useMemo(() => {
    if (!courses) return [];
    let list = courses.map((c: Course) => ({
      id: c.id,
      slug: c.slug ?? "",
      thumbnail_key: c.thumbnail_key ?? null,
      thumbnail_url: c.thumbnail_url ?? null,
      title: c.title ?? "",
      type: c.type ?? "",
      is_published: c.is_published ?? false,
      updated_at: c.updated_at ?? "",
      description: c.description ?? null,
      price: c.price ?? null,
      language: c.language ?? "",
      created_at: c.created_at ?? "",
    }));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.description ?? "").toLowerCase().includes(q) ||
          (c.slug ?? "").toLowerCase().includes(q) ||
          (c.type ?? "").toLowerCase().includes(q) ||
          (c.language ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [courses, searchQuery]);

  const columns: Column<Course>[] = [
    {
      key: "thumbnail",
      header: "Thumbnail",
      accessor: (row) => (
        <CourseThumbnailEditor
          course={row}
          onUploaded={refetch}
          variant="table"
        />
      ),
    },
    {
      key: "title",
      header: "Title",
      accessor: (row) => (
        <div className="flex items-center w-max">
          <div className="ml-2">
            <p className="text-sm font-medium text-slate-900">{row.title}</p>
            <p className="text-xs text-slate-500">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      accessor: (row) => (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {row.type}
        </span>
      ),
    },
    {
      key: "description",
      header: "Description",
      accessor: (row) => (
        <span
          className="text-slate-700 line-clamp-2 max-w-xs"
          title={row.description ?? ""}
        >
          {row.description ?? "—"}
        </span>
      ),
    },
    {
      key: "price",
      header: "Price",
      accessor: (row) => (
        <span className="text-slate-900 font-semibold">
          {row.price != null ? `${Number(row.price).toFixed(2)} INR` : "—"}
        </span>
      ),
    },
    {
      key: "language",
      header: "Language",
      accessor: (row) => <span className="text-slate-700">{row.language}</span>,
    },
    {
      key: "is_published",
      header: "Published",
      accessor: (row) => (
        <span
          className={
            row.is_published ? "text-green-600 font-medium" : "text-slate-500"
          }
        >
          {row.is_published ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Created",
      accessor: (row) => (
        <span className="text-slate-700 text-sm">
          {row.created_at ? new Date(row.created_at).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "updated_at",
      header: "Updated",
      accessor: (row) => (
        <span className="text-slate-600 text-sm">
          {row.updated_at ? new Date(row.updated_at).toLocaleDateString() : "—"}
        </span>
      ),
    },
  ];

  const handleAddCourse = () => {
    setModalMode("create");
    setSelectedCourse(null);
    setCourseModalOpen(true);
  };

  const handleEditCourse = (row: Course) => {
    setModalMode("edit");
    setSelectedCourse(row);
    setCourseModalOpen(true);
  };


  const handleViewCourse = (row: Course) => {
    router.push(`/course?slug=${encodeURIComponent(row.slug ?? "")}`);
  };



  const handleDeleteCourse = (row: Course) => {
    setCourseToDelete(row);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete?.slug) return;
    try {
      await deleteCourseMutation.mutateAsync(courseToDelete.slug);
      toast.success("Course deleted successfully!");
      setDeleteConfirmOpen(false);
      setCourseToDelete(null);
      setDeleteConfirmInput("");
      refetch();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to delete course"));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setCourseToDelete(null);
    setDeleteConfirmInput("");
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="px-6 pt-10 flex flex-col gap-6 flex-wrap">
        <div className="flex items-center justify-between flex-wrap ">
          <h1 className="text-2xl font-semibold text-slate-800">
            Course Management
          </h1>

            <SearchBar
              placeholder="Search courses..."
              onSearch={(value) => setSearchQuery(value)}
            />
          <div className="flex items-center gap-3 ">
            <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Table view"
                className={`rounded-md p-2 transition-colors ${
                  viewMode === "grid"
                    ? "bg-slate-100 text-slate-800"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <List className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("card")}
                title="Card view"
                className={`rounded-md p-2 transition-colors ${
                  viewMode === "card"
                    ? "bg-slate-100 text-slate-800"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <LayoutGrid className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <NeumorphismButton
              name="Add Course"
              icon={<FiPlus />}
              onClick={handleAddCourse}
            />
            </div>
        </div>

        {isLoading && (
          <SkeletonTable
            title="Courses"
            columnCount={9}
            rowCount={5}
            showActions
          />
        )}

        {isError && (
          <div className="border border-red-200 bg-red-50 p-3 rounded-lg text-red-700">
            <p>Failed to load courses.</p>
            <p className="text-sm opacity-80">{(error as Error)?.message}</p>
            <button className="mt-2 underline" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && viewMode === "grid" && (
          <DataTable<Course>
            title="Courses"
            columns={columns}
            data={courseRows}
            getRowId={(row) => row.id}
            onView={handleViewCourse}
            onEdit={handleEditCourse}
            onDelete={handleDeleteCourse}
          />
        )}

        {!isLoading && !isError && viewMode === "card" && (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Courses</h2>
            {courseRows.length === 0 ? (
              <p className="text-slate-600 font-medium py-8 text-center">No courses found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {courseRows.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onView={handleViewCourse}
                    onEdit={handleEditCourse}
                    onDelete={handleDeleteCourse}
                    onThumbnailUpdated={refetch}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <CommonModal isOpen={courseModalOpen} setIsOpen={setCourseModalOpen}>
        <CourseForm
          mode={modalMode}
          course={selectedCourse}
          onClose={() => {
            setCourseModalOpen(false);
            setSelectedCourse(null);
            refetch();
          }}
        />
      </CommonModal>

  
      <CommonModal
        isOpen={deleteConfirmOpen}
        setIsOpen={(open) => {
          setDeleteConfirmOpen(open);
          if (!open) {
            setCourseToDelete(null);
            setDeleteConfirmInput("");
          }
        }}
      >
        <div className="flex flex-col gap-5 py-2">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-3 rounded-full bg-red-100 ring-4 ring-red-50">
              <AlertTriangle className="w-7 h-7 text-red-600" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-semibold text-slate-900">
                Delete course
              </h3>
              <p className="text-slate-600 mt-1">
                Are you sure you want to delete this course? This will
                permanently remove it and cannot be undone.
              </p>
            </div>
          </div>

          {courseToDelete && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-3">
                Course to remove
              </p>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 p-2.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                  <Trash2 className="w-5 h-5 text-slate-600" aria-hidden />
                </div>
                <div className="min-w-0 flex-1 break-words">
                  <p className="font-semibold text-slate-900">
                    {courseToDelete.title}
                  </p>
                  <p className="text-sm text-slate-600 mt-0.5">
                    Slug: {courseToDelete.slug}
                  </p>
                </div>
              </div>
            </div>
          )}

          {courseToDelete && (
            <div>
              <label htmlFor="delete-course-confirm" className="block text-sm font-medium text-slate-700 mb-1.5">
                Type <span className="font-semibold text-slate-900">{courseToDelete.slug}</span> to confirm
              </label>
              <input
                id="delete-course-confirm"
                type="text"
                value={deleteConfirmInput}
                onChange={(e) => setDeleteConfirmInput(e.target.value)}
                placeholder={`Enter "${courseToDelete.slug}"`}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoComplete="off"
              />
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDeleteCancel}
              disabled={deleteCourseMutation.isPending}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleteCourseMutation.isPending || deleteConfirmInput.trim() !== courseToDelete?.slug}
              className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 transition-colors font-medium flex items-center justify-center gap-2 min-w-[130px]"
            >
              {deleteCourseMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" aria-hidden />
                  Delete course
                </>
              )}
            </button>
          </div>
        </div>
      </CommonModal>
    </main>
  );
}

function CourseCard({
  course,
  onView,
  onEdit,
  onDelete,
  onThumbnailUpdated,
}: {
  course: Course;
  onView: (row: Course) => void;
  onEdit: (row: Course) => void;
  onDelete: (row: Course) => void;
  onThumbnailUpdated?: () => void;
}) {
  return (
    <div className="group flex flex-col rounded-xl bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.06)] dark:bg-neutral-800 overflow-hidden border border-slate-200/80 hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)] hover:border-slate-300/80 transition-all duration-200">
      <div className="relative w-full aspect-video flex-shrink-0 bg-slate-100 overflow-hidden">
        <CourseThumbnailEditor
          course={course}
          onUploaded={onThumbnailUpdated ?? (() => {})}
          variant="card"
        />
      </div>
      <div className="flex flex-col justify-start p-4 flex-1">
        <h5 className="mb-1 text-lg font-semibold text-neutral-800 dark:text-neutral-50 line-clamp-1">
          {course.title}
        </h5>
        <p className="text-xs text-slate-500 dark:text-neutral-400 mb-2">{course.slug}</p>
        <span className="inline-flex w-fit px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mb-2">
          {course.type}
        </span>
        <p className="mb-2 text-sm text-neutral-600 dark:text-neutral-200 line-clamp-2 flex-1 min-h-[2.5rem]">
          {course.description ?? "No description"}
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-300 mb-3">
          {course.price != null && (
            <span className="font-semibold text-slate-700">{Number(course.price).toFixed(2)} INR</span>
          )}
          <span>{course.language}</span>
          <span className={course.is_published ? "text-green-600 font-medium" : ""}>
            {course.is_published ? "Published" : "Draft"}
          </span>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
          Updated {course.updated_at ? new Date(course.updated_at).toLocaleDateString() : "—"}
        </p>
        <div className="flex items-center gap-1 pt-3 border-t border-slate-100">
          <button
            type="button"
            title="View"
            onClick={() => onView(course)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          >
            <IconEye className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Edit"
            onClick={() => onEdit(course)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          >
            <IconEdit className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Delete"
            onClick={() => onDelete(course)}
            className="p-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <IconTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

const NeumorphismButton = ({
  name,
  icon,
  onClick,
}: {
  name: string;
  icon?: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    className="px-4 py-2 rounded-full flex items-center gap-2 text-slate-500 border border-black-700 shadow-[-5px_-5px_10px_rgba(255,_255,_255,_0.8),_5px_5px_10px_rgba(0,_0,_0,_0.25)] transition-all hover:shadow-[-1px_-1px_5px_rgba(255,_255,_255,_0.6),_1px_1px_5px_rgba(0,_0,_0,_0.3),inset_-2px_-2px_5px_rgba(255,_255,_255,_1),inset_2px_2px_4px_rgba(0,_0,_0,_0.3)] hover:text-blue-500"
    onClick={onClick}
  >
    {icon}
    <span>{name}</span>
  </button>
);

function CourseThumbnailEditor({
  course,
  onUploaded,
  variant = "table",
}: {
  course: Course;
  onUploaded: () => void;
  variant?: "table" | "card";
}) {
  const updateThumbnailMutation = useUpdateCourseThumbnailMutation(course.slug);
  const deleteThumbMutation = useDeleteCourseThumbnailMutation(course.slug);

  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  const hasThumb = Boolean(course.thumbnail_url);
  const isCard = variant === "card";

  const isBusy =
    updateThumbnailMutation.isPending || deleteThumbMutation.isPending;

  const openModal = () => {
    setSelectedFile(null);
    setShowUploader(!hasThumb);
    setOpen(true);
  };

  const onPickFile = (files: File[]) => {
    const f = files?.[0] ?? null;
    if (!f) {
      setSelectedFile(null);
      return;
    }

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(f.type)) {
      toast.error("Only JPG / PNG / WEBP are allowed");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(f);
  };

  const handleUpload = async () => {
    if (!course.slug) {
      toast.error("Course slug missing");
      return;
    }
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    try {
      const signed = await getCourseThumbnailSignedUrlApi({
        file_type: selectedFile.type as "image/jpeg" | "image/png" | "image/webp",
      });

      const uploadUrl =
        (signed.upload_url as string | undefined) ||
        (signed.signed_url as string | undefined) ||
        (signed.url as string | undefined);

      if (!uploadUrl || !signed.object_key) {
        throw new Error("Invalid signed URL response from server");
      }

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      if (!uploadRes.ok) throw new Error("Failed to upload file to storage");

      await updateThumbnailMutation.mutateAsync(signed.object_key);

      toast.success("Thumbnail updated");
      onUploaded();

      setOpen(false);
      setSelectedFile(null);
      setShowUploader(false);
    } catch (err) {
      toast.error((err as { message?: string })?.message ?? "Upload failed");
    }
  };

  const handleDeleteThumbnail = async () => {
    try {
      await deleteThumbMutation.mutateAsync();

      toast.success("Thumbnail deleted");

      setSelectedFile(null);
      setShowUploader(true);

      onUploaded();
    } catch (err) {
      toast.error(
        (err as { message?: string })?.message ?? "Failed to delete thumbnail"
      );
    }
  };

  const trigger = hasThumb ? (
    <button
      type="button"
      onClick={openModal}
      className={isCard ? "group/thumb relative h-full w-full block" : "group/thumb relative block"}
      title="Click to preview/update thumbnail"
    >
      <img
        src={course.thumbnail_url!}
        alt={course.title}
        className={
          isCard
            ? "h-full w-full object-cover transition-transform group-hover/thumb:scale-105"
            : "w-20 h-12 rounded-md object-cover border border-slate-200"
        }
      />
      <span
        className={
          isCard
            ? "absolute inset-0 bg-black/0 group-hover/thumb:bg-black/30 transition flex items-center justify-center"
            : "absolute inset-0 rounded-md bg-black/0 group-hover/thumb:bg-black/20 transition"
        }
      >
        {isCard && (
          <span className="opacity-0 group-hover/thumb:opacity-100 transition-opacity text-white text-sm font-medium px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm">
            Update thumbnail
          </span>
        )}
      </span>
    </button>
  ) : (
    <button
      type="button"
      onClick={openModal}
      className={
        isCard
          ? "h-full w-full flex items-center justify-center border border-dashed border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-colors"
          : "w-20 h-12 rounded-md border border-dashed border-slate-300 flex items-center justify-center hover:bg-slate-50 transition"
      }
      title="Upload thumbnail"
    >
      <UploadCloud
        className={isCard ? "w-14 h-14 text-slate-400" : "w-5 h-5 text-slate-500"}
        aria-hidden
      />
    </button>
  );

  return (
    <>
      <div className={isCard ? "absolute inset-0" : "flex items-center"}>
        {trigger}
      </div>

      {/* MODAL */}
      <CommonModal
        isOpen={open}
        setIsOpen={(v) => {
          setOpen(v);
          if (!v) {
            setSelectedFile(null);
            setShowUploader(false);
          }
        }}
      >
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {hasThumb ? "Update thumbnail" : "Upload thumbnail"}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Choose a JPG/PNG/WEBP image and click Upload.
            </p>
          </div>

          {hasThumb && !showUploader && (
            <div className="w-full">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <img
                    src={course.thumbnail_url!}
                    alt="Current thumbnail"
                    className="w-full max-h-[340px] object-contain"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={isBusy}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-60"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={handleDeleteThumbnail}
                  disabled={isBusy}
                  className="px-4 py-2 rounded-lg border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-60 flex items-center gap-2"
                >
                  {deleteThumbMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting…
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {(!hasThumb || showUploader) && (
            <>
              <div className="w-full">
                <FileUpload onChange={onPickFile} />
                {selectedFile && (
                  <p className="text-xs text-slate-600 mt-2">
                    Selected:{" "}
                    <span className="font-medium">{selectedFile.name}</span>
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    if (hasThumb) {
                      setSelectedFile(null);
                      setShowUploader(false);
                      return;
                    }
                    setOpen(false);
                    setSelectedFile(null);
                  }}
                  disabled={isBusy}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={isBusy || !selectedFile}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2"
                >
                  {updateThumbnailMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading…
                    </>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </CommonModal>
    </>
  );
}

