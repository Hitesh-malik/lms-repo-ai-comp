"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormInput from "@/components/Common/FormInput";
import FormSelect from "@/components/Common/FormSelect";
import { useUpdateQuizMutation } from "@/hooks/useCourseMutations";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { Quiz } from "@/services/courseApi";

const editQuizValidationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must not exceed 255 characters"),
  description: Yup.string()
    .nullable()
    .transform((v) => (v === "" ? null : v))
    .max(2000, "Description must not exceed 2000 characters"),
  instructions: Yup.string()
    .nullable()
    .transform((v) => (v === "" ? null : v))
    .max(2000, "Instructions must not exceed 2000 characters"),
  max_attempts: Yup.number()
    .integer("Must be a whole number")
    .min(1, "Minimum 1 attempt")
    .max(10, "Maximum 10 attempts"),
  passing_percentage: Yup.number()
    .integer("Must be a whole number")
    .min(0, "Minimum 0%")
    .max(100, "Maximum 100%"),
  quiz_type: Yup.string().required("Quiz type is required"),
  time_limit_minutes: Yup.number()
    .nullable()
    .transform((v) => (v === "" || v == null ? null : Number(v)))
    .integer("Must be a whole number")
    .min(1, "Minimum 1 minute")
    .max(300, "Maximum 300 minutes"),
});

export type EditQuizFormValues = {
  title: string;
  description: string;
  instructions: string;
  max_attempts: number;
  passing_percentage: number;
  quiz_type: string;
  time_limit_minutes: string;
};

function getInitialValues(quiz: Quiz): EditQuizFormValues {
  return {
    title: quiz.title ?? "",
    description: quiz.description ?? "",
    instructions: quiz.instructions ?? "",
    max_attempts: quiz.max_attempts ?? 3,
    passing_percentage: quiz.passing_percentage ?? 50,
    quiz_type: quiz.quiz_type ?? "practice",
    time_limit_minutes:
      quiz.time_limit_minutes != null ? String(quiz.time_limit_minutes) : "",
  };
}

interface EditQuizFormProps {
  quiz: Quiz;
  onSuccess: () => void;
  onClose: () => void;
}

export default function EditQuizForm({
  quiz,
  onSuccess,
  onClose,
}: EditQuizFormProps) {
  const updateQuizMutation = useUpdateQuizMutation(quiz.id);

  const handleSubmit = async (values: EditQuizFormValues) => {
    try {
      await updateQuizMutation.mutateAsync({
        title: values.title.trim(),
        description: values.description.trim() || null,
        instructions: values.instructions.trim() || null,
        max_attempts: Number(values.max_attempts) || 3,
        passing_percentage: Number(values.passing_percentage) ?? 50,
        quiz_type: values.quiz_type || "practice",
        time_limit_minutes: values.time_limit_minutes
          ? Number(values.time_limit_minutes)
          : null,
      });
      toast.success("Quiz updated successfully!");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to update quiz"));
    }
  };

  return (
    <div className="flex flex-col gap-5 py-2 max-h-[85vh] overflow-y-auto">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Update Quiz</h3>
        <p className="text-sm text-slate-600 mt-1">Update quiz details.</p>
      </div>

      <Formik<EditQuizFormValues>
        initialValues={getInitialValues(quiz)}
        validationSchema={editQuizValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <FormInput
              name="title"
              label="Quiz title"
              placeholder="e.g. Module 1 Quiz"
              required
            />
            <FormInput
              name="description"
              label="Description"
              placeholder="Optional description"
              required={false}
            />
            <FormInput
              name="instructions"
              label="Instructions"
              placeholder="Instructions for the quiz (optional)"
              required={false}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                name="max_attempts"
                label="Max attempts"
                type="number"
                placeholder="3"
                required
              />
              <FormInput
                name="passing_percentage"
                label="Passing %"
                type="number"
                placeholder="50"
                required
              />
            </div>
            <FormSelect
              name="quiz_type"
              label="Quiz type"
              placeholder="Select type"
              required
              options={[
                { value: "practice", label: "Practice" },
                { value: "graded", label: "Graded" },
                { value: "survey", label: "Survey" },
              ]}
            />
            <FormInput
              name="time_limit_minutes"
              label="Time limit (minutes)"
              type="number"
              placeholder="No limit"
              required={false}
            />

            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting || updateQuizMutation.isPending}
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || updateQuizMutation.isPending}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors font-medium flex items-center justify-center gap-2 min-w-[130px]"
              >
                {isSubmitting || updateQuizMutation.isPending ? (
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
