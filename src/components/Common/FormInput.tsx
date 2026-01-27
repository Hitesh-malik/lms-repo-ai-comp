import { useField } from "formik";

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export default function FormInput({
  name,
  label,
  type = "text",
  placeholder,
  required = true,
}: FormInputProps) {
  const [field, meta] = useField(name);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-slate-700 text-sm font-semibold">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <input
        {...field}
        type={type}
        placeholder={placeholder}
        className={`
          w-full
          px-4 py-3
          border border-slate-300 rounded-lg
          bg-white
          text-slate-900 text-sm
          placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
          transition-all duration-200
          hover:border-slate-400
          ${meta.touched && meta.error ? "border-red-400 focus:ring-red-400" : ""}
        `}
      />

      {meta.touched && meta.error && (
        <span className="text-red-500 text-xs font-medium flex items-center gap-1">
          <svg
            className="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {meta.error}
        </span>
      )}
    </div>
  );
}
