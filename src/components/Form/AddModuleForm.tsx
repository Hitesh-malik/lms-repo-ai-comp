"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormInput from "@/components/Common/FormInput";
import { useAddModuleMutation } from "@/hooks/useCourseMutations";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const addModuleValidationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(4, "Title must be at least 4 characters")
    .max(255, "Title must not exceed 255 characters"),
  description: Yup.string()
    .nullable()
    .transform((v) => (v === "" ? null : v))
    .min(4, "Description must be at least 4 characters when provided")
    .max(255, "Description must not exceed 255 characters"),
  order_index: Yup.number()
    .required("Order is required")
    .integer("Order must be a whole number")
    .min(1, "Order must be at least 1"),
});

export type AddModuleFormValues = {
  title: string;
  description: string;
  order_index: number;
};

const initialValues = (defaultOrder: number): AddModuleFormValues => ({
  title: "",
  description: "",
  order_index: defaultOrder,
});

interface AddModuleFormProps {
  slug: string;
  nextOrderIndex?: number;
  onClose: () => void;
}

export default function AddModuleForm({
  slug,
  nextOrderIndex = 1,
  onClose,
}: AddModuleFormProps) {
  const addModuleMutation = useAddModuleMutation(slug);

  const handleSubmit = async (values: AddModuleFormValues) => {
    try {
      await addModuleMutation.mutateAsync({
        title: values.title.trim(),
        description: values.description.trim() || null,
        order_index: Number(values.order_index) || 1,
      });
      toast.success("Module created successfully!");
      onClose();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to add module"));
    }
  };

  return (
    <div className="flex flex-col gap-5 py-2">
      <h3 className="text-xl font-semibold text-slate-900">Add Module</h3>

      <Formik<AddModuleFormValues>
        initialValues={initialValues(nextOrderIndex)}
        validationSchema={addModuleValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-5">
            <FormInput
              name="title"
              label="Title"
              placeholder="Enter module title"
              required
            />
            <FormInput
              name="description"
              label="Description"
              placeholder="Enter description (optional)"
              required={false}
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
                disabled={isSubmitting || addModuleMutation.isPending}
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || addModuleMutation.isPending}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors font-medium flex items-center justify-center gap-2 min-w-[130px]"
              >
                {isSubmitting || addModuleMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden />
                    Adding…
                  </>
                ) : (
                  "Add Module"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
