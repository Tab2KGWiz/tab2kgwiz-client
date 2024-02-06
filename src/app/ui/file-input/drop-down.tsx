import React from "react";

interface Props {
  toggleDropDown: () => void;
  isDropDownOpen: boolean;
  dataType: string | undefined;
  xsdDataType: string[] | undefined;
  handleXSDFormat: (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) => void;
}

const DropDownUI: React.FC<Props> = (props): JSX.Element => {
  return (
    <div>
      <div className="relative" data-te-dropdown-ref>
        <button
          className="flex items-center whitespace-nowrap rounded bg-primary text-xs font-medium leading-normal text-gray-700 
          px-0 pb-[0px] pt-[0px] bg-gray-50"
          type="button"
          id="dropdownMenuButton"
          onClick={props.toggleDropDown}
          data-te-dropdown-toggle-ref
          aria-expanded="false"
          data-te-ripple-init
          data-te-ripple-color="light"
        >
          {`[${props.dataType}]`}
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
          className="absolute z-[1000] float-left m-0 min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left 
          text-base shadow-lg dark:bg-neutral-700 [&[data-te-dropdown-show]]:block"
          hidden={props.isDropDownOpen ? false : true}
          aria-labelledby="dropdownMenuButton1"
          data-te-dropdown-menu-ref
        >
          {props.xsdDataType?.map((item, index) => (
            <li
              key={index}
              className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <div className="flex items-center h-5">
                <input
                  id={`helper-radio-${index + 1}`}
                  name="helper-radio"
                  type="radio"
                  value={`${item}`}
                  onClick={props.handleXSDFormat}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 
                      dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                />
              </div>
              <div className="ms-2">
                <label
                  htmlFor={`helper-radio-${index + 1}`}
                  data-te-dropdown-menu-ref
                  className="bg-primary text-xs font-medium leading-normal text-gray-700 bg-gray-50"
                >
                  <div>{item}</div>
                  <p
                    id={`helper-radio-text-${index + 1}`}
                    className="text-xs font-normal text-gray-500 dark:text-gray-300"
                  ></p>
                </label>
              </div>
            </li>
          ))}
          <li></li>
        </ul>
      </div>
    </div>
  );
};

export default DropDownUI;
