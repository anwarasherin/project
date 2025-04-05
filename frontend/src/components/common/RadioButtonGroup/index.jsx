import ErrorMessage from "../ErrorMessage";

function RadioButtonGroup({ title, name, options, register, error }) {
  return (
    <div className="my-2">
      <h3 className="text-sm/6 font-bold text-gray-900">{title}</h3>
      <ul className="flex w-full text-sm font-medium text-gray-900 bg-white border border-gray-400 rounded-lg">
        {options.map((option, index) => (
          <li
            key={option.value}
            className="w-full border-b border-gray-400 sm:border-b-0 sm:border-r"
          >
            <div className="flex items-center ps-3">
              <input
                id={`${name}-${option.value}`}
                type="radio"
                value={option.value}
                {...register(name)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-500 focus:ring-blue-500
                      dark:bg-gray-600 dark:border-gray-500"
              />
              <label
                htmlFor={`${name}-${option.value}`}
                className="w-full py-2 ms-2 text-sm font-medium text-gray-900"
              >
                {option.label}
              </label>
            </div>
          </li>
        ))}
      </ul>
      {error && <ErrorMessage message={error.message} />}
    </div>
  );
}

export default RadioButtonGroup;
