import React from "react";

type IconType = React.ComponentType<{ className?: string }>;

interface AuthInputProps {
  icon: IconType;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;

  // allow passing the exact wrapper class you already had (so no UI change)
  wrapperClassName: string;
}

export default function AuthInput({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  wrapperClassName,
}: AuthInputProps) {
  return (
    <div className={wrapperClassName}>
      <div className="flex items-center justify-center">
        <Icon className="2xl:text-xl xl:text-lg lg:text-base md:text-base sm:text-base text-sm text-gray-400" />
      </div>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-none outline-none bg-transparent font-semibold 2xl:text-xl xl:text-lg lg:text-base md:text-base sm:text-base text-sm text-gray-800 placeholder:text-gray-400 placeholder:font-medium"
      />
    </div>
  );
}
