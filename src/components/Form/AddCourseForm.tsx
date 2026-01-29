"use client";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import FormInput from "@/components/Common/FormInput";
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "@/hooks/useCourseMutations";
import {
  Course,
  CreateCourseBody,
  UpdateCourseBody,
} from "@/services/courseApi";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const courseValidationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(4, "Title must be at least 4 characters")
    .max(255, "Title must not exceed 255 characters"),

  // slug comes from title (still validate length)
  slug: Yup.string()
    .required("Slug is required")
    .min(4, "Slug must be at least 4 characters")
    .max(255, "Slug must not exceed 255 characters"),

  description: Yup.string().nullable(),
  language: Yup.string()
    .nullable()
    .transform((v) => (v === "" ? null : v))
    .min(2, "Language must be at least 2 characters")
    .max(50, "Language must not exceed 50 characters"),
  price: Yup.number()
    .nullable()
    .transform((v) => (v === "" || Number.isNaN(v) ? null : v))
    .min(0, "Price must be 0 or greater"),
  type: Yup.string()
    .nullable()
    .transform((v) => (v === "" ? null : v))
    .min(2, "Type must be at least 2 characters")
    .max(50, "Type must not exceed 50 characters"),

  is_published: Yup.boolean(),
});

export type CourseFormValues = {
  title: string;
  slug: string;
  description: string;
  language: string;
  price: string;
  type: string;
  is_published: boolean;
};

function toInitialValues(course?: Course | null): CourseFormValues {
  const title = course?.title ?? "";
  return {
    title,
    slug: course?.slug ?? title, // default slug to title
    description: course?.description ?? "",
    language: course?.language ?? "",
    price: course?.price != null ? String(course.price) : "",
    type: course?.type ?? "",
    is_published: course?.is_published ?? false,
  };
}

// Keeps slug always equal to title
function SlugSync({ title }: { title: string }) {
  // This component is just for clarity; actual syncing happens in Formik render below
  return null;
}

export default function CourseForm({
  mode,
  onClose,
  course,
}: {
  mode: "create" | "edit";
  onClose: () => void;
  course?: Course | null;
}) {
  const createCourseMutation = useCreateCourseMutation();
  const updateCourseMutation = useUpdateCourseMutation(course?.slug ?? "");

  const isEdit = mode === "edit";
  const initialValues = toInitialValues(course);

  const handleSubmit = async (values: CourseFormValues) => {
    const title = values.title.trim();
    const slug = title; // ✅ slug = title (as you want)

    try {
      if (!isEdit) {
        const body: CreateCourseBody = {
          title,
          slug, // ✅ slug=title
          description: values.description.trim() || null,
          language: values.language.trim() || null,
          price: values.price === "" ? null : Number(values.price),
          type: values.type.trim() || null,

        };

        await createCourseMutation.mutateAsync(body);
        toast.success("Course created successfully!");
      } else {
        if (!course?.slug) throw new Error("Course slug missing");

        const body: UpdateCourseBody = {
          title,
          slug, // ✅ slug=title in update too
          description: values.description.trim() || null,
          language: values.language.trim() || null,
          price: values.price === "" ? null : Number(values.price),
          type: values.type.trim() || null,
          is_published: values.is_published, // ✅ include is_published in update
        };

        await updateCourseMutation.mutateAsync(body);
        toast.success("Course updated successfully!");
      }

      onClose();
    } catch (err: unknown) {
      toast.error(
        getApiErrorMessage(
          err,
          isEdit ? "Failed to update course" : "Failed to create course"
        )
      );
    }
  };

  const isPending = isEdit
    ? updateCourseMutation.isPending
    : createCourseMutation.isPending;

  return (
    <div className="flex flex-col gap-5 py-2">
      <h3 className="text-xl font-semibold text-slate-900">
        {isEdit ? "Edit Course" : "Add Course"}
      </h3>

      <Formik<CourseFormValues>
        initialValues={initialValues}
        enableReinitialize
        validationSchema={courseValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue }) => {
          // ✅ keep slug synced with title always
          useEffect(() => {
            const nextSlug = values.title?.trim() ?? "";
            setFieldValue("slug", nextSlug, false);
          }, [values.title, setFieldValue]);

          return (
            <Form className="flex flex-col gap-5">
              <FormInput
                name="title"
                label="Title"
                placeholder="Enter course title"
                required
              />

              {/* ✅ slug shown (read-only) and auto-set = title */}
              <FormInput
                name="slug"
                label="Slug (auto)"
                placeholder="Auto from title"
                required
              />

              <FormInput
                name="description"
                label="Description"
                placeholder="Enter description (optional)"
                required={false}
              />

              <FormInput
                name="language"
                label="Language"
                placeholder="e.g. English (optional)"
                required={false}
              />

              <FormInput
                name="price"
                label="Price"
                type="number"
                placeholder="0 (optional)"
                required={false}
              />

              <FormInput
                name="type"
                label="Type"
                placeholder="e.g. Video, Live (optional)"
                required={false}
              />

              {/* ✅ Published checkbox (mainly for edit, but you can allow in create too) */}
              {
                isEdit && (<div className="flex items-center gap-3">
                  <Field
                    type="checkbox"
                    name="is_published"
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <label className="text-sm text-slate-700">
                    Publish this course
                  </label>
                </div>
                )}


              <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting || isPending}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || isPending}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors font-medium flex items-center justify-center gap-2 min-w-[130px]"
                >
                  {isSubmitting || isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isEdit ? "Updating…" : "Creating…"}
                    </>
                  ) : isEdit ? (
                    "Update Course"
                  ) : (
                    "Create Course"
                  )}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
