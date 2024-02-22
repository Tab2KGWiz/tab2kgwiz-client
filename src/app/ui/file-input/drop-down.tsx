import React from "react";
import xsdDataType from "@/app/utils/xsdDataTypes";

interface Props {
  toggleDropDown: () => void;
  isDropDownOpen: boolean;
  dropDownId: number;
  selectedDataType: string | undefined;
  handleXSDFormat: (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) => void;
}

const DropDownUI: React.FC<Props> = (props): JSX.Element => {
  return (
    <div>
      <div className="relative">
        <button
          className="flex items-center whitespace-nowrap rounded bg-primary text-xs font-medium leading-normal text-gray-700 
          px-0 pb-[0px] pt-[0px] bg-gray-50"
          type="button"
          id="dropdownMenuButton"
          onClick={props.toggleDropDown}
          aria-expanded="false"
          data-te-ripple-init
          data-te-ripple-color="light"
        >
          {`[${props.selectedDataType}]`}
          <span className="ml-0 w-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        </button>
        <ul
          className="absolute float-left w-38 m-0 overflow-hidden min-w-max rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg 
          dark:bg-neutral-700 [&[data-te-dropdown-show]]:block"
          hidden={props.isDropDownOpen ? false : true}
          aria-labelledby="dropdownMenuButton1"
        >
          {xsdDataType.map((item, index) => (
            <li
              key={index}
              className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600"
            >
              <div className="flex items-center ps-3">
                <input
                  id={`helper-radio-${props.dropDownId}-${index + 1}`}
                  name="helper-radio"
                  type="radio"
                  value={`${item}`}
                  //checked={props.selectedDataType === item}
                  disabled={props.selectedDataType === item}
                  onClick={props.handleXSDFormat}
                  className={`w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 
                  dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500`}
                />
                <label
                  htmlFor={`helper-radio-${props.dropDownId}-${index + 1}`}
                  className="w-full py-3 ms-2 text-xs font-medium text-gray-900 dark:text-gray-300"
                >
                  {item}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropDownUI;
