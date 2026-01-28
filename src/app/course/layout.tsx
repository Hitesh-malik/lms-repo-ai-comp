import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "View Course",
  description: "View and manage course content and modules",
};

export default function CourseLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}