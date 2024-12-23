interface Hook {
  memoizedState: any;
  next: Hook | null;
}

let firstWorkInProgressHook: Hook | null = null; // 첫 번째 훅
let workInProgressHook: Hook | null = null; // 현재 작업 중인 훅
let isRerender = false;

export const resetHooks = () => {
  // workInProgressHook 훅을 다시 첫 번째 훅으로 설정
  workInProgressHook = firstWorkInProgressHook;
  isRerender = true;
};

export const workInProgressHookFn = (): Hook => {
  if (isRerender && workInProgressHook) {
    // 리렌더링 시 기존 훅 재사용
    const currentHook = workInProgressHook;
    workInProgressHook = workInProgressHook.next;
    return currentHook;
  }

  const hook: Hook = {
    memoizedState: null,
    next: null,
  };

  if (workInProgressHook === null) {
    // 첫 번째 훅인 경우(현재 작업 중인 훅이 없는 경우)
    firstWorkInProgressHook = workInProgressHook = hook;
    return hook;
  }

  // 새로운 훅 연결(이미 작업 중인 훅이 존재하지만, 그 다음 훅이 없으면 새로운 훅 연결)
  workInProgressHook = workInProgressHook.next = hook;
  return hook;
};
