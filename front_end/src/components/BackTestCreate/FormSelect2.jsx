/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function FormSelect({
  name,
  options,
  setValues,
  handleStrategyChange,
  handleStateChange,
}) {
  const [selected, setSelected] = useState(options[Object.keys(options)[0]]);

  const handleSelectClick = (option) => {
    handleStateChange(name, option);
  };

  const paintOptions = Object.values(options).map((option, idx) => (
    <div key={idx} onClick={() => handleSelectClick(option)}>
      <Listbox.Option
        className={({ active }) =>
          classNames(
            active ? "text-white bg-indigo-600" : "text-gray-900",
            "cursor-default select-none relative py-2 pl-3 pr-9"
          )
        }
        value={option}
      >
        {({ selected, active }) => (
          <>
            <div className="flex items-center">
              <span className={"ml-3 block truncate"}>{option}</span>
            </div>

            {selected ? (
              <span
                className={classNames(
                  active ? "text-white" : "text-indigo-600",
                  "absolute inset-y-0 right-0 flex items-center pr-4"
                )}
              >
                <CheckIcon className="h-5 w-5" aria-hidden="true" />
              </span>
            ) : null}
          </>
        )}
      </Listbox.Option>
    </div>
  ));

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <div className="mt-1 relative">
            <Listbox.Button
              className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              aria-haspopup="listbox"
              aria-expanded="true"
              aria-labelledby="listbox-label"
            >
              <span className="flex items-center">
                <span className="ml-3 block truncate">{selected}</span>
              </span>
              <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                  className="-mr-1 ml-2 h-5 w-5"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              as={Fragment}
              show={open}
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {paintOptions}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
