"use client";

import DataTable, { Column } from "@/components/Common/DataTable";
import { SearchBar } from "@/components/Common/searchBar";
import { useCoursesAdminQuery } from "@/hooks/useCourseQueries";
import { Course } from "@/services/courseApi";
import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";

export default function CourseManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: courses, isLoading, isError, error, refetch } = useCoursesAdminQuery();

  const courseRows: Course[] = useMemo(() => {
    if (!courses) return [];
    let list = courses.map((c: Course | Record<string, unknown>) => ({
      id: String((c as Course).id ?? (c as Record<string, unknown>).id ?? ""),
      title: String((c as Course).title ?? (c as Record<string, unknown>).title ?? "—"),
      description: String((c as Course).description ?? (c as Record<string, unknown>).description ?? "—"),
      is_published: (c as Course).is_published ?? (c as Record<string, unknown>).is_published as boolean | undefined,
      created_at: ((c as Course).created_at ?? (c as Record<string, unknown>).created_at) as string | undefined,
    }));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.description ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [courses, searchQuery]);

  const columns: Column<Course>[] = [
    {
      key: "title",
      header: "Title",
      accessor: (row) => (
        <div className="flex items-center w-max">
          <div className="ml-2">
            <p className="text-sm font-medium text-slate-900">{row.title}</p>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      accessor: (row) => (
        <span className="text-slate-700 line-clamp-2 max-w-xs" title={row.description}>
          {row.description ?? "—"}
        </span>
      ),
    },
    {
      key: "is_published",
      header: "Published",
      accessor: (row) => (
        <span className={row.is_published ? "text-green-600" : "text-slate-500"}>
          {row.is_published ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Created",
      accessor: (row) => (
        <span className="text-slate-700">
          {row.created_at
            ? new Date(row.created_at).toLocaleDateString()
            : "—"}
        </span>
      ),
    },
  ];

  const handleAddCourse = () => {
    // TODO: open Add Course modal / drawer
  };

  const handleEditCourse = (_row: Course) => {
    // TODO: open Edit Course modal
  };

  const handleDeleteCourse = (_row: Course) => {
    // TODO: open Delete confirmation
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="px-6 pt-10 flex flex-col gap-6 flex-wrap">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800">
            Course Management
          </h1>

          <SearchBar
            placeholder="Search courses..."
            onSearch={(value) => setSearchQuery(value)}
          />
          <NeumorphismButton
            name="Add Course"
            icon={<FiPlus />}
            onClick={handleAddCourse}
          />
        </div>

        {isLoading && <p className="text-slate-600">Loading courses...</p>}

        {isError && (
          <div className="border border-red-200 bg-red-50 p-3 rounded-lg text-red-700">
            <p>Failed to load courses.</p>
            <p className="text-sm opacity-80">{(error as Error)?.message}</p>
            <button className="mt-2 underline" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <DataTable<Course>
            title="Courses"
            columns={columns}
            data={courseRows}
            getRowId={(row) => row.id}
            onEdit={handleEditCourse}
            onDelete={handleDeleteCourse}
          />
        )}
      </div>
    </main>
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
