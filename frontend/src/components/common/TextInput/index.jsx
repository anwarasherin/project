import { Field, Input, Label } from "@headlessui/react";
import { cn } from "../../../utils";

export default function TextInput({
  label,
  fieldClass,
  labelClass,
  inputClass,
  placeholder = "",
  value,
  onChange,
  name,
  type = "text",
  ...rest
}) {
  return (
    <Field className={fieldClass}>
      <Label className={cn("text-sm/6 font-medium text-white", labelClass)}>
        {label}
      </Label>
      <Input
        type={type}
        name={name}
        className={cn(inputClass)}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </Field>
  );
}
