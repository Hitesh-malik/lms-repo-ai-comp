"use client";

import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import FormInput from "@/components/Common/FormInput";
import { useUpdateLessonMutation } from "@/hooks/useCourseMutations";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Lesson } from "@/services/courseApi";

const editLessonValidationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(4, "Title must be at least 4 characters")
    .max(255, "Title must not exceed 255 characters"),
  description: Yup.string()
    .nullable()
    .transform((v) => (v === "" ? null : v))
    .min(4, "Description must be at least 4 characters when provided")
    .max(255, "Description must not exceed 255 characters"),
  is_published: Yup.boolean().required(),
  is_free_preview: Yup.boolean().required(),
});

export type EditLessonFormValues = {
  title: string;
  description: string;
  is_published: boolean;
  is_free_preview: boolean;
};

function FormCheckbox({ name, label }: { name: string; label: string }) {
  const [field, meta] = useField({ name, type: "checkbox" });

  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          {...field}
          checked={!!field.value}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-slate-500"
        />
        <span className="text-slate-700 text-sm font-medium">{label}</span>
      </label>
      {meta.touched && meta.error && (
        <span className="text-red-500 text-xs font-medium">{meta.error}</span>
      )}
    </div>
  );
}

interface EditLessonFormProps {
  slug: string;
  lesson: Lesson;
  onClose: () => void;
}

export default function EditLessonForm({ slug, lesson, onClose }: EditLessonFormProps) {
  const updateLessonMutation = useUpdateLessonMutation(slug);

  const initialValues: EditLessonFormValues = {
    title: lesson.title ?? "",
    description: lesson.description ?? "",
    is_published: lesson.is_published ?? false,
    is_free_preview: lesson.is_free_preview ?? false,
  };

  const handleSubmit = async (values: EditLessonFormValues) => {
    try {
      await updateLessonMutation.mutateAsync({
        lessonId: lesson.id,
        body: {
          title: values.title.trim() || null,
          description: values.description.trim() || null,
          is_published: values.is_published,
          is_free_preview: values.is_free_preview,
        },
      });
      toast.success("Lesson updated successfully!");
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } }; message?: string })
          ?.response?.data?.detail ??
        (err as { message?: string })?.message ??
        "Failed to update lesson";
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col gap-5 py-2">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Edit Lesson</h3>
        <p className="text-sm text-slate-600 mt-1">
          {lesson.content_type} · Order {lesson.order_index}
        </p>
      </div>

      <Formik<EditLessonFormValues>
        initialValues={initialValues}
        validationSchema={editLessonValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-5">
            <FormInput
              name="title"
              label="Title"
              placeholder="Enter lesson title"
              required
            />
            <FormInput
              name="description"
              label="Description"
              placeholder="Enter description (optional)"
              required={false}
            />
            <FormCheckbox name="is_published" label="Published" />
            <FormCheckbox name="is_free_preview" label="Free preview" />

            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting || updateLessonMutation.isPending}
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || updateLessonMutation.isPending}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors font-medium flex items-center justify-center gap-2 min-w-[130px]"
              >
                {isSubmitting || updateLessonMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                    Saving…
                  </>
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
