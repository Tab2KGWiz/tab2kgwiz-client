import { useRef } from "react";

function useDebounce(callback: Function, delay: number) {
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  function debouncedCallback(...args: any) {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }

  return debouncedCallback;
}

export default useDebounce;
