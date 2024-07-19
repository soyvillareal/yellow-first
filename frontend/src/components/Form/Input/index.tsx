import { useMemo, useState } from "react";
import { Controller, Path, useFormContext } from "react-hook-form";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import { IInputLabel } from "./InputLabel.types";

function InputLabel<
  TFieldValues extends Record<string, string>,
  TFieldName extends Path<TFieldValues>,
>({
  id,
  type,
  label,
  placeholder,
  validate,
  disabled = false,
  required = false,
}: IInputLabel<TFieldValues, TFieldName>) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    formState: { errors },
  } = useFormContext<TFieldValues>();

  const hasError = errors[id];

  const inputType = useMemo(() => {
    if (type === "password") {
      return showPassword ? "text" : "password";
    }
    return type;
  }, [type, showPassword]);

  return (
    <Controller
      name={id}
      control={control}
      rules={{
        validate,
      }}
      render={({ field, fieldState }) => (
        <div>
          <div className="relative">
            <label
              htmlFor={id}
              className="block mb-2 text-sm font-medium text-gray-100"
            >
              {label}
            </label>
            {type === "password" &&
              (showPassword ? (
                <EyeIcon
                  onClick={() => setShowPassword(false)}
                  className="absolute w-6 h-6 text-gray-500 cursor-pointer right-2 bottom-2"
                />
              ) : (
                <EyeSlashIcon
                  onClick={() => setShowPassword(true)}
                  className="absolute w-6 h-6 text-gray-500 cursor-pointer right-2 bottom-2"
                />
              ))}
            <input
              {...field}
              name={id}
              className="border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-gray-100 focus:ring-cyan-800 focus:border-cyan-800"
              type={inputType}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
            />
          </div>

          {fieldState.invalid || hasError ? (
            <p className="text-red">{fieldState.error?.message}</p>
          ) : null}
        </div>
      )}
    />
  );
}

export default InputLabel;
