import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

export default function DropDownMenu({ menuButton, options }) {
  return (
    <Menu>
      <MenuButton>{menuButton}</MenuButton>
      <MenuItems
        transition
        anchor="bottom end"
        className="w-32 right-0 top-1 rounded-md border border-white/5 bg-white text-sm/6 text-black transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        {options.map((option, index) => {
          const { icon, label, onClick } = option;
          return (
            <MenuItem key={index}>
              <button
                onClick={onClick}
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-gray-100"
              >
                {icon}
                {label}
              </button>
            </MenuItem>
          );
        })}
      </MenuItems>
    </Menu>
  );
}
