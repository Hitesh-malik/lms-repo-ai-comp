"use client";

import { Formik, Form, useField } from "formik";
import * as Yup from "yup";
import FormInput from "@/components/Common/FormInput";
import { useUpdateModuleMutation } from "@/hooks/useCourseMutations";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Module } from "@/services/courseApi";

const editModuleValidationSchema = Yup.object({
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
});

export type EditModuleFormValues = {
  title: string;
  description: string;
  is_published: boolean;
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

interface EditModuleFormProps {
  slug: string;
  module: Module;
  onClose: () => void;
}

export default function EditModuleForm({ slug, module: mod, onClose }: EditModuleFormProps) {
  const updateModuleMutation = useUpdateModuleMutation(slug);

  const initialValues: EditModuleFormValues = {
    title: mod.title ?? "",
    description: mod.description ?? "",
    is_published: mod.is_published ?? false,
  };

  const handleSubmit = async (values: EditModuleFormValues) => {
    try {
      await updateModuleMutation.mutateAsync({
        moduleId: mod.id,
        body: {
          title: values.title.trim() || null,
          description: values.description.trim() || null,
          is_published: values.is_published,
        },
      });
      toast.success("Module updated successfully!");
      onClose();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to update module"));
    }
  };

  return (
    <div className="flex flex-col gap-5 py-2">
      <div>
        <h3 className="text-xl font-semibold text-slate-900">Edit Module</h3>
        <p className="text-sm text-slate-600 mt-1">Order {mod.order_index}</p>
      </div>

      <Formik<EditModuleFormValues>
        initialValues={initialValues}
        validationSchema={editModuleValidationSchema}
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
            <FormCheckbox name="is_published" label="Published" />

            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting || updateModuleMutation.isPending}
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || updateModuleMutation.isPending}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors font-medium flex items-center justify-center gap-2 min-w-[130px]"
              >
                {isSubmitting || updateModuleMutation.isPending ? (
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
