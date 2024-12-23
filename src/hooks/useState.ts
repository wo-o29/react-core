import { updateSchedule } from "../dom/render";
import { workInProgressHookFn } from "./hooks";

const useState = <T>(
  initialState: T | (() => T)
): [T, (value: T | ((prev: T) => T)) => void] => {
  const hook = workInProgressHookFn();

  if (hook.memoizedState === null) {
    hook.memoizedState =
      typeof initialState === "function"
        ? (initialState as () => T)()
        : initialState;
  }

  const setState = (value: T | ((prev: T) => T)) => {
    const newState =
      typeof value === "function"
        ? (value as (prev: T) => T)(hook.memoizedState)
        : value;

    if (!Object.is(newState, hook.memoizedState)) {
      hook.memoizedState = newState;
      updateSchedule();
    }
  };

  return [hook.memoizedState, setState];
};

export default useState;
