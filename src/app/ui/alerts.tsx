import React from "react";

interface Props {
  message: string;
  type: string;
  toggleAlert: () => void;
}

const AlertsUI: React.FC<Props> = (props): JSX.Element => {
  return (
    <div className="fixed bottom-4 right-4 z-10">
      {props.type === "Error" && (
        <div
          className="relative px-4 py-3 leading-normal text-red-700 bg-red-100 rounded-lg"
          role="alert"
        >
          <span className="absolute inset-y-0 left-0 flex items-center ml-4">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
                fillRule="evenodd"
              ></path>
            </svg>
          </span>
          <p className="ml-6">{props.message}</p>
        </div>
      )}

      {props.type === "Success" && (
        <div
          className="px-4 py-3 leading-normal text-green-700 bg-green-100 rounded-lg"
          role="alert"
        >
          <p>{props.message}</p>
        </div>
      )}
    </div>

    // <div
    //   className={`block transform transition-all duration-150 ease-out scale-0 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative
    //   ${props.showAlert ? "scale-100" : "scale-0"}`}
    //   role="alert"
    //   // hidden={!props.showAlert}
    // >
    //   <strong className="font-bold">Error! </strong>
    //   <span className="block sm:inline">{props.message}</span>
    //   <button onClick={props.toggleAlert}>
    //     <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
    //       <svg
    //         className="fill-current h-6 w-6 text-red-500"
    //         role="button"
    //         xmlns="http://www.w3.org/2000/svg"
    //         viewBox="0 0 20 20"
    //       >
    //         <title>Close</title>
    //         <path
    //           d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10
    //       8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
    //         />
    //       </svg>
    //     </span>
    //   </button>
    // </div>
  );
};

export default AlertsUI;
