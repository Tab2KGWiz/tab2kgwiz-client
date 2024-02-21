import React from "react";

interface Props {
  toogleModal: () => void;
  isModalOpen: boolean;
  itemsList: string[] | undefined;
  measureMap: Map<string, boolean>;
  toogleMeasure: (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
  ) => void;
}

const MeasureFormUI: React.FC<Props> = (props): JSX.Element => {
  return (
    <div>
      <button
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 
        mb-4 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={props.toogleModal}
      >
        Measurement Form
      </button>
      {props.isModalOpen && (
        <div
          id="mesurement-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 bottom-0 left-0 flex z-50 justify-center items-center w-full backdrop-blur-sm md:inset-0 
        h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Measurement fields
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center 
                items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={props.toogleModal}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              {props.itemsList?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700"
                >
                  <input
                    // checked={props.measureMap.get(item)}
                    defaultChecked={props.measureMap.get(item)}
                    id={`measurement-checkbox-${index}`}
                    type="checkbox"
                    value={`${item}`}
                    name="measurement-checkbox"
                    onClick={props.toogleMeasure}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 
                    focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor={`measurement-checkbox-${index}`}
                    className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {item}
                  </label>
                </div>
              ))}

              <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 
                text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={props.toogleModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeasureFormUI;
