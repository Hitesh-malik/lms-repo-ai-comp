import { Suspense } from "react";
import CourseContent from "./CourseContent";

export default function CoursePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-slate-600">Loading…</p>
        </main>
      }
    >
      <CourseContent />
    </Suspense>
  );
}
