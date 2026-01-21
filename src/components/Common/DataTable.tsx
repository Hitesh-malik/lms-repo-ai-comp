// components/DataTable.tsx
import React from "react";

type Accessor<T> = keyof T | ((row: T) => React.ReactNode);

export type Column<T> = {
  key: string;                 // unique key for react
  header: React.ReactNode;     // column title
  accessor: Accessor<T>;       // which field to show OR function(row) => node
  className?: string;          // td styles
  headerClassName?: string;    // th styles
};

type RowId<T> = (row: T, index: number) => string | number;

type DataTableProps<T> = {
  title?: string;
  columns: Column<T>[];
  data: T[];
  getRowId?: RowId<T>;

  // Actions (optional)
  showActions?: boolean;
  actionsHeader?: React.ReactNode;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;

  // Empty state
  emptyText?: string;

  // Optional wrapper classes
  className?: string;
};

function getCellValue<T>(row: T, accessor: Accessor<T>) {
  if (typeof accessor === "function") return accessor(row);
  return row[accessor] as React.ReactNode;
}

export default function DataTable<T>({
  title,
  columns,
  data,
  getRowId,
  showActions = true,
  actionsHeader = "Action",
  onView,
  onEdit,
  onDelete,
  emptyText = "No data found",
  className = "",
}: DataTableProps<T>) {
  const shouldShowActions = showActions && (onView || onEdit || onDelete);

  return (
    <div className={className}>
      {title ? <h2 className="text-lg font-semibold text-slate-900 mb-3">{title}</h2> : null}

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50 whitespace-nowrap">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={
                    col.headerClassName ??
                    "px-4 py-3 text-left text-sm font-medium text-slate-600"
                  }
                >
                  {col.header}
                </th>
              ))}

              {shouldShowActions ? (
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                  {actionsHeader}
                </th>
              ) : null}
            </tr>
          </thead>

          <tbody className="whitespace-nowrap divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (shouldShowActions ? 1 : 0)}
                  className="px-4 py-6 text-sm text-slate-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const id = getRowId ? getRowId(row, index) : index;

                return (
                  <tr key={id} className="hover:bg-gray-50">
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={col.className ?? "px-4 py-3 text-sm text-slate-700"}
                      >
                        {getCellValue(row, col.accessor)}
                      </td>
                    ))}

                    {shouldShowActions ? (
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {onView ? (
                            <button
                              type="button"
                              onClick={() => onView(row)}
                              className="flex items-center gap-2 rounded-lg text-slate-700 bg-gray-50 border border-gray-200 px-3 py-1 hover:bg-gray-100"
                            >
                              View
                            </button>
                          ) : null}

                          {onEdit ? (
                            <button
                              type="button"
                              onClick={() => onEdit(row)}
                              className="flex items-center gap-2 rounded-lg text-blue-600 bg-blue-50 border border-gray-200 px-3 py-1 hover:bg-blue-100"
                            >
                              Edit
                            </button>
                          ) : null}

                          {onDelete ? (
                            <button
                              type="button"
                              onClick={() => onDelete(row)}
                              className="flex items-center gap-2 rounded-lg text-red-600 bg-red-50 border border-gray-200 px-3 py-1 hover:bg-red-100"
                            >
                              Delete
                            </button>
                          ) : null}
                        </div>
                      </td>
                    ) : null}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
 