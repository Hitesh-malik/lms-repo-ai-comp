"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormInput from "@/components/Common/FormInput";
import FormSelect from "@/components/Common/FormSelect";
import { useAddQuizQuestionMutation } from "@/hooks/useCourseMutations";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const addQuestionValidationSchema = Yup.object({
  question_text: Yup.string()
    .required("Question text is required")
    .min(10, "Question must be at least 10 characters")
    .max(2000, "Question must not exceed 2000 characters"),
  option_a: Yup.string()
    .required("Option A is required")
    .min(1, "Option A is required")
    .max(500, "Option A must not exceed 500 characters"),
  option_b: Yup.string()
    .required("Option B is required")
    .min(1, "Option B is required")
    .max(500, "Option B must not exceed 500 characters"),
  option_c: Yup.string()
    .required("Option C is required")
    .min(1, "Option C is required")
    .max(500, "Option C must not exceed 500 characters"),
  option_d: Yup.string()
    .required("Option D is required")
    .min(1, "Option D is required")
    .max(500, "Option D must not exceed 500 characters"),
  correct_answer: Yup.string()
    .required("Correct answer is required")
    .length(1, "Select one option (A, B, C, or D)")
    .oneOf(["A", "B", "C", "D"], "Must be A, B, C, or D"),
  explanation: Yup.string()
    .nullable()
    .transform((v) => (v === "" ? null : v))
    .max(1000, "Explanation must not exceed 1000 characters"),
  marks: Yup.number()
    .min(0, "Minimum 0")
    .max(10, "Maximum 10"),
  negative_marks: Yup.number()
    .min(0, "Minimum 0")
    .max(5, "Maximum 5"),
  difficulty_level: Yup.string().required("Difficulty is required"),
  order_index: Yup.number()
    .integer("Must be a whole number")
    .min(1, "Minimum 1"),
});

export type AddQuestionFormValues = {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  marks: number;
  negative_marks: number;
  difficulty_level: string;
  order_index: number;
};

const initialValues: AddQuestionFormValues = {
  question_text: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_answer: "",
  explanation: "",
  marks: 1,
  negative_marks: 0.25,
  difficulty_level: "medium",
  order_index: 1,
};

interface AddQuestionFormProps {
  quizId: string;
  defaultOrderIndex?: number;
  onSuccess: () => void;
  onClose: () => void;
}

export default function AddQuestionForm({
  quizId,
  defaultOrderIndex = 1,
  onSuccess,
  onClose,
}: AddQuestionFormProps) {
  const addQuestionMutation = useAddQuizQuestionMutation(quizId);

  const handleSubmit = async (values: AddQuestionFormValues) => {
    try {
      await addQuestionMutation.mutateAsync({
        question_text: values.question_text.trim(),
        option_a: values.option_a.trim(),
        option_b: values.option_b.trim(),
        option_c: values.option_c.trim(),
        option_d: values.option_d.trim(),
        correct_answer: values.correct_answer.trim(),
        explanation: values.explanation.trim() || null,
        marks: Number(values.marks) ?? 1,
        negative_marks: Number(values.negative_marks) ?? 0.25,
        difficulty_level: values.difficulty_level || "medium",
        order_index: Number(values.order_index) || 1,
      });
      toast.success("Question added successfully!");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to add question"));
    }
  };

  return (
    <div className="flex flex-col gap-5 py-2 max-h-[85vh] overflow-y-auto">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Add Question</h3>
        <p className="text-sm text-slate-600 mt-1">Add a multiple choice question to the quiz.</p>
      </div>

      <Formik<AddQuestionFormValues>
        initialValues={{ ...initialValues, order_index: defaultOrderIndex }}
        validationSchema={addQuestionValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <FormInput
              name="question_text"
              label="Question text"
              placeholder="Enter the question"
              required
            />
            <div className="grid grid-cols-1 gap-3">
              <FormInput name="option_a" label="Option A" placeholder="First option" required />
              <FormInput name="option_b" label="Option B" placeholder="Second option" required />
              <FormInput name="option_c" label="Option C" placeholder="Third option" required />
              <FormInput name="option_d" label="Option D" placeholder="Fourth option" required />
            </div>
            <FormSelect
              name="correct_answer"
              label="Correct answer"
              placeholder="Select correct option"
              required
              options={[
                { value: "A", label: "A" },
                { value: "B", label: "B" },
                { value: "C", label: "C" },
                { value: "D", label: "D" },
              ]}
            />
            <FormInput
              name="explanation"
              label="Explanation (optional)"
              placeholder="Explanation shown after answering"
              required={false}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormInput
                name="marks"
                label="Marks"
                type="number"
                placeholder="1"
                required={false}
              />
              <FormInput
                name="negative_marks"
                label="Negative marks"
                type="number"
                placeholder="0.25"
                required={false}
              />
              <FormInput
                name="order_index"
                label="Order"
                type="number"
                placeholder="1"
                required={false}
              />
            </div>
            <FormSelect
              name="difficulty_level"
              label="Difficulty"
              placeholder="Select difficulty"
              required
              options={[
                { value: "easy", label: "Easy" },
                { value: "medium", label: "Medium" },
                { value: "hard", label: "Hard" },
              ]}
            />

            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting || addQuestionMutation.isPending}
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || addQuestionMutation.isPending}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors font-medium flex items-center justify-center gap-2 min-w-[130px]"
              >
                {isSubmitting || addQuestionMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                    Adding…
                  </>
                ) : (
                  "Add Question"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
