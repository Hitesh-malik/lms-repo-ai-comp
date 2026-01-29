import { Skeleton } from "@/components/ui/skeleton";

type SkeletonTableProps = {
  title?: string;
  columnCount?: number;
  rowCount?: number;
  showActions?: boolean;
  className?: string;
};

export function SkeletonTable({
  title = "Loading",
  columnCount = 9,
  rowCount = 5,
  showActions = true,
  className = "",
}: SkeletonTableProps) {
  return (
    <div className={className}>
      {title ? (
        <h2 className="text-lg font-semibold text-slate-900 mb-3">{title}</h2>
      ) : null}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-slate-200 rounded-lg shadow-md">
          <thead className="bg-gray-800 whitespace-nowrap">
            <tr>
              {Array.from({ length: columnCount }).map((_, i) => (
                <th
                  key={i}
                  className="p-4 text-left text-sm font-medium text-white"
                >
                  <Skeleton className="h-4 w-16 bg-slate-600" />
                </th>
              ))}
              {showActions ? (
                <th className="p-4 text-left text-sm font-medium text-white">
                  <Skeleton className="h-4 w-14 bg-slate-600" />
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody className="whitespace-nowrap">
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="even:bg-blue-50"
              >
                {Array.from({ length: columnCount }).map((_, colIndex) => (
                  <td
                    key={colIndex}
                    className="p-4 text-[15px] text-slate-600 font-medium"
                  >
                    {/* First column: thumbnail-style when multi-column; second: title-style; rest: default */}
                    {colIndex === 0 && columnCount > 1 ? (
                      <Skeleton className="h-12 w-20 rounded-md" />
                    ) : colIndex === 1 && columnCount > 2 ? (
                      <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    ) : (
                      <Skeleton className="h-4 flex-1 min-w-[4rem] w-24" />
                    )}
                  </td>
                ))}
                {showActions ? (
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded" />
                      <Skeleton className="h-5 w-5 rounded" />
                      <Skeleton className="h-5 w-5 rounded" />
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
