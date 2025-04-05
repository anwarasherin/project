import { Button as ButtonBase } from "@headlessui/react";
import { cn } from "../../../utils";

export default function Button({ className = "", ...props }) {
  return (
    <ButtonBase
      className={cn(
        "inline-flex items-center gap-2 rounded-md bg-blue-500 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-blue-400 data-[open]:bg-blue-500 data-[focus]:outline-1 data-[focus]:outline-white",
        className
      )}
      {...props}
    />
  );
}
