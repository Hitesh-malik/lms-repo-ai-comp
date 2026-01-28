"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormInput from "@/components/Common/FormInput";
import FormSelect from "@/components/Common/FormSelect";
import { useAddLessonMutation } from "@/hooks/useCourseMutations";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const addLessonValidationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(4, "Title must be at least 4 characters")
    .max(255, "Title must not exceed 255 characters"),
  description: Yup.string()
    .nullable()
    .transform((v) => (v === "" ? null : v))
    .min(4, "Description must be at least 4 characters when provided")
    .max(255, "Description must not exceed 255 characters"),
  content_type: Yup.string()
    .required("Content type is required")
    .oneOf(["video", "quiz", "live"], "Content type must be video, quiz, or live"),
  order_index: Yup.number()
    .required("Order is required")
    .integer("Order must be a whole number")
    .min(1, "Order must be at least 1"),
});

export type AddLessonFormValues = {
  title: string;
  description: string;
  content_type: "video" | "quiz" | "live";
  order_index: number;
};

const initialValues = (defaultOrder: number): AddLessonFormValues => ({
  title: "",
  description: "",
  content_type: "video",
  order_index: defaultOrder,
});

interface AddLessonFormProps {
  slug: string;
  moduleId: string;
  moduleTitle: string;
  nextOrderIndex?: number;
  onClose: () => void;
}

export default function AddLessonForm({
  slug,
  moduleId,
  moduleTitle,
  nextOrderIndex = 1,
  onClose,
}: AddLessonFormProps) {
  const addLessonMutation = useAddLessonMutation(slug);

  const handleSubmit = async (values: AddLessonFormValues) => {
    try {
      await addLessonMutation.mutateAsync({
        moduleId,
        body: {
          title: values.title.trim(),
          description: values.description.trim() || null,
          content_type: values.content_type,
          order_index: Number(values.order_index) || 1,
        },
      });
      toast.success("Lesson created successfully!");
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } }; message?: string })
          ?.response?.data?.detail ??
        (err as { message?: string })?.message ??
        "Failed to add lesson";
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col gap-5 py-2">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Add Lesson</h3>
        <p className="text-sm text-slate-600 mt-1">Module: {moduleTitle}</p>
      </div>

      <Formik<AddLessonFormValues>
        initialValues={initialValues(nextOrderIndex)}
        validationSchema={addLessonValidationSchema}
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
            <FormSelect
              name="content_type"
              label="Content Type"
              placeholder="Select content type"
              required
              options={[
                { value: "video", label: "Video" },
                { value: "quiz", label: "Quiz" },
                { value: "live", label: "Live" },
              ]}
            />
            <FormInput
              name="order_index"
              label="Order index"
              type="number"
              placeholder="1"
              required
            />

            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting || addLessonMutation.isPending}
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || addLessonMutation.isPending}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors font-medium flex items-center justify-center gap-2 min-w-[130px]"
              >
                {isSubmitting || addLessonMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                    Adding…
                  </>
                ) : (
                  "Add Lesson"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
