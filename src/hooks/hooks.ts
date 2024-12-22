interface Hook<T> {
  memoizedState: T;
  next: Hook<T> | null;
}

let firstWorkInProgressHook: Hook<any> | null = null; // 첫 번째 훅
let workInProgressHook: Hook<any> | null = null; // 현재 작업 중인 훅

export const resetHooks = () => {
  // workInProgressHook 훅을 다시 첫 번째 훅으로 설정
  workInProgressHook = firstWorkInProgressHook;
};

export const workInProgressHookFn = <T>(hookId: number): Hook<T> => {
  const hook: Hook<T> = {
    memoizedState: null as T,
    next: null,
  };

  if (workInProgressHook === null) {
    // 첫 번째 훅인 경우(현재 작업 중인 훅이 없는 경우)
    firstWorkInProgressHook = workInProgressHook = hook;
    return hook;
  }

  if (workInProgressHook.next === null && hookId !== 0) {
    // 새로운 훅 연결(이미 작업 중인 훅이 존재하지만, 그 다음 훅이 없으면 새로운 훅 연결)
    workInProgressHook = workInProgressHook.next = hook;
    return hook;
  }

  const currentHook = workInProgressHook;
  workInProgressHook = workInProgressHook.next;
  return currentHook;
};
