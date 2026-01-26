import React from "react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
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
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
 
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
  onEdit,
  onDelete,
  emptyText = "No data found",
  className = "",
}: DataTableProps<T>) {
  const shouldShowActions = showActions && (onEdit || onDelete);

  return (
    <div className={className}>
      {title ? (
        <h2 className="text-lg font-semibold text-slate-900 mb-3">{title}</h2>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-slate-200 rounded-lg shadow-md">
          <thead className="bg-gray-800 whitespace-nowrap">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={
                    col.headerClassName ??
                    "p-4 text-left text-sm font-medium text-white"
                  }
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
                          "p-4 text-[15px] text-slate-600 font-medium"
                        }
                      >
                        {getCellValue(row, col.accessor)}
                      </td>
                    ))}

                    {shouldShowActions ? (
                      <td className="p-4">
                        <div className="flex items-center">
                          {onEdit ? (
                            <button
                              type="button"
                              title="Edit"
                              onClick={() => onEdit(row)}
                              className="mr-3 cursor-pointer"
                            >
                              <IconEdit />
                            </button>
                          ) : null}

                          {onDelete ? (
                            <button
                              type="button"
                              title="Delete"
                              onClick={() => onDelete(row)}
                              className="cursor-pointer"
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
