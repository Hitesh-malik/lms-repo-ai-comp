import { useField } from "formik";

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

export default function FormInput({
  name,
  label,
  type = "text",
  placeholder,
}: FormInputProps) {
  const [field, meta] = useField(name);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-slate-500 text-sm font-medium">{label}</label>

      <input
        {...field}
        type={type}
        placeholder={placeholder}
        className="
          px-2 py-2
          border-b border-gray-300
          focus:border-slate-900
          outline-none
          text-sm
          bg-white
        "
      />

      {meta.touched && meta.error && (
        <span className="text-red-500 text-xs">{meta.error}</span>
      )}
    </div>
  );
}
