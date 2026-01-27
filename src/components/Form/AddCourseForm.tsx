"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormInput from "@/components/Common/FormInput";
import { useCreateCourseMutation } from "@/hooks/useCourseMutations";
import { CreateCourseBody } from "@/services/courseApi";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const addCourseValidationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(4, "Title must be at least 4 characters")
    .max(255, "Title must not exceed 255 characters"),
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
});

export type AddCourseFormValues = {
  title: string;
  description: string;
  language: string;
  price: string;
  type: string;
};

const initialValues: AddCourseFormValues = {
  title: "",
  description: "",
  language: "",
  price: "",
  type: "",
};

interface AddCourseFormProps {
  onClose: () => void;
}

export default function AddCourseForm({ onClose }: AddCourseFormProps) {
  const createCourseMutation = useCreateCourseMutation();

  const handleSubmit = async (values: AddCourseFormValues) => {
    const title = values.title.trim();
    const body: CreateCourseBody = {
      title,
      slug: title,
      description: values.description.trim() || null,
      language: values.language.trim() || null,
      price: values.price === "" ? null : Number(values.price),
      type: values.type.trim() || null,
    };

    try {
      await createCourseMutation.mutateAsync(body);
      toast.success("Course created successfully!");
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } }; message?: string })
          ?.response?.data?.detail ??
        (err as { message?: string })?.message ??
        "Failed to create course";
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col gap-5 py-2">
      <h3 className="text-xl font-semibold text-slate-900">Add Course</h3>

      <Formik<AddCourseFormValues>
        initialValues={initialValues}
        validationSchema={addCourseValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-5">
            <FormInput
              name="title"
              label="Title"
              placeholder="Enter course title"
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

            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting || createCourseMutation.isPending}
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || createCourseMutation.isPending}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors font-medium flex items-center justify-center gap-2 min-w-[130px]"
              >
                {isSubmitting || createCourseMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                    Creating…
                  </>
                ) : (
                  "Create Course"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
