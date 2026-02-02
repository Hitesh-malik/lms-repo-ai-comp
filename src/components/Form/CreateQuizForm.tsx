"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormInput from "@/components/Common/FormInput";
import FormSelect from "@/components/Common/FormSelect";
import { useCreateQuizForLessonMutation } from "@/hooks/useCourseMutations";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const createQuizValidationSchema = Yup.object({
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

export type CreateQuizFormValues = {
  title: string;
  description: string;
  instructions: string;
  max_attempts: number;
  passing_percentage: number;
  quiz_type: string;
  time_limit_minutes: string;
};

const initialValues: CreateQuizFormValues = {
  title: "",
  description: "",
  instructions: "",
  max_attempts: 3,
  passing_percentage: 50,
  quiz_type: "practice",
  time_limit_minutes: "",
};

interface CreateQuizFormProps {
  lessonId: string;
  lessonTitle: string;
  slug: string;
  onSuccess: (quizId: string) => void;
  onClose: () => void;
}

export default function CreateQuizForm({
  lessonId,
  lessonTitle,
  slug,
  onSuccess,
  onClose,
}: CreateQuizFormProps) {
  const createQuizMutation = useCreateQuizForLessonMutation(slug, lessonId);

  const handleSubmit = async (values: CreateQuizFormValues) => {
    try {
      const quiz = await createQuizMutation.mutateAsync({
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
      toast.success("Quiz created successfully!");
      onSuccess(quiz.id);
      onClose();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to create quiz"));
    }
  };

  return (
    <div className="flex flex-col gap-5 py-2">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Create Quiz</h3>
        <p className="text-sm text-slate-600 mt-1">Lesson: {lessonTitle}</p>
      </div>

      <Formik<CreateQuizFormValues>
        initialValues={initialValues}
        validationSchema={createQuizValidationSchema}
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
                disabled={isSubmitting || createQuizMutation.isPending}
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || createQuizMutation.isPending}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors font-medium flex items-center justify-center gap-2 min-w-[130px]"
              >
                {isSubmitting || createQuizMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                    Creating…
                  </>
                ) : (
                  "Create Quiz"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
