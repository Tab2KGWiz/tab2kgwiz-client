import { useEffect, useRef } from "react";

const useOutsideClick = (callback: () => void) => {
  // useOutsideClick hook takes a callback function as an argument, which will be triggered when a click event occurs outside the ref element.
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  // The ref object is returned from the hook, which can be attached to the root element of the component that needs to listen for outside click events.
  // When a click event occurs outside the ref element, the callback will be triggered.
  return ref;
};

export default useOutsideClick;
