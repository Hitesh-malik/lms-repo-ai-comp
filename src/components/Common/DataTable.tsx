import React from "react";
import { IconEdit, IconEye, IconTrash, IconUser } from "@tabler/icons-react";
type Accessor<T> = keyof T | ((row: T) => React.ReactNode);

export type Column<T> = {
  key: string;
  header: React.ReactNode;
  accessor: Accessor<T>;
  className?: string;
  headerClassName?: string;
};

type RowId<T> = (row: T, index: number) => string | number;

type DataTableProps<T> = {
  title?: string;
  columns: Column<T>[];
  data: T[];
  getRowId?: RowId<T>;

 
  showActions?: boolean;
  actionsHeader?: React.ReactNode;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onRole?: (row: T) => void;
 
  emptyText?: string;
 
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
  actionsHeader = "Actions",
  onView,
  onEdit,
  onDelete,
  onRole,
  emptyText = "No data found",
  className = "",
}: DataTableProps<T>) {
  const shouldShowActions = showActions && (onView || onEdit || onDelete || onRole);

  return (
    <div className={className}>
      {title ? (
        <h2 className="text-lg font-semibold text-slate-900 mb-3">{title}</h2>
      ) : null}

      <div className="overflow-x-auto w-full" style={{ scrollbarWidth: 'thin', WebkitOverflowScrolling: 'touch' }}>
        <table className="bg-white border border-slate-200 rounded-lg shadow-md" style={{ width: '100%', minWidth: 'max-content', tableLayout: 'auto' }}>
          <thead className="bg-gray-800 whitespace-nowrap">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={
                    col.headerClassName ??
                    "p-4 text-left text-sm font-medium text-white whitespace-nowrap"
                  }
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {col.header}
                </th>
              ))}

              {shouldShowActions ? (
                <th className="p-4 text-left text-sm font-medium text-white">
                  {actionsHeader}
                </th>
              ) : null}
            </tr>
          </thead>

          <tbody className="whitespace-nowrap">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (shouldShowActions ? 1 : 0)}
                  className="p-4 text-[15px] text-slate-600 font-medium"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const id = getRowId ? getRowId(row, index) : index;

                return (
                  <tr key={id} className="even:bg-blue-50">
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={
                          col.className ??
                          "p-4 text-[15px] text-slate-600 font-medium whitespace-nowrap"
                        }
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {getCellValue(row, col.accessor)}
                      </td>
                    ))}

                    {shouldShowActions ? (
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {onView ? (
                            <button
                              type="button"
                              title="View"
                              onClick={() => onView(row)}
                              className="cursor-pointer text-slate-600 hover:text-slate-800 transition-colors"
                            >
                              <IconEye />
                            </button>
                          ) : null}
                          {onRole ? (
                            <button
                              type="button"
                              title="Assign Role"
                              onClick={() => onRole(row)}
                              className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <IconUser />
                            </button>
                          ) : null}

                          {onEdit ? (
                            <button
                              type="button"
                              title="Edit"
                              onClick={() => onEdit(row)}
                              className="cursor-pointer text-slate-600 hover:text-slate-800 transition-colors"
                            >
                              <IconEdit />
                            </button>
                          ) : null}

                          {onDelete ? (
                            <button
                              type="button"
                              title="Delete"
                              onClick={() => onDelete(row)}
                              className="cursor-pointer text-red-600 hover:text-red-800 transition-colors"
                            >
                              <IconTrash />
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
