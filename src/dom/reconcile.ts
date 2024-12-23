import { VirtualNode, Props, HTMLNode } from "../types";

// DiffResult 관련 타입들
export type PropChange =
  | { type: "SET_PROP"; key: string; value: any }
  | { type: "REMOVE_PROP"; key: string };

export type ChildChange =
  | { type: "ADD_CHILD"; node: VirtualNode; index: number }
  | { type: "REMOVE_CHILD"; index: number }
  | { type: "UPDATE_CHILD"; change: DiffResult; index: number };

export type DiffResult =
  | { type: "NO_CHANGE" }
  | { type: "REPLACE"; node: VirtualNode }
  | { type: "UPDATE_TEXT"; text: string | number }
  | { type: "UPDATE"; props?: PropChange[]; children?: ChildChange[] };

export const reconcile = (
  currentVirtualNode: VirtualNode,
  progressVirtualNode: VirtualNode
): DiffResult => {
  // 두 노드가 모두 null이면 변경 없음
  if (!currentVirtualNode && !progressVirtualNode) {
    return { type: "NO_CHANGE" };
  }

  // 한 노드만 null이면 노드 교체
  if (!currentVirtualNode || !progressVirtualNode) {
    return { type: "REPLACE", node: progressVirtualNode };
  }

  const currentType = currentVirtualNode.type;
  const progressType = progressVirtualNode.type;

  // 노드 타입이 다르면 노드 교체
  if (currentType !== progressType) {
    return { type: "REPLACE", node: progressVirtualNode };
  }

  // 텍스트 노드 처리
  if (currentType === "textNode" && progressType === "textNode") {
    if (currentVirtualNode.props.text !== progressVirtualNode.props.text) {
      return { type: "UPDATE_TEXT", text: progressVirtualNode.props.text };
    }
    return { type: "NO_CHANGE" };
  }

  // Fragment 노드 처리
  if (currentType === "fragment" && progressType === "fragment") {
    if (
      currentVirtualNode.props.children &&
      progressVirtualNode.props.children
    ) {
      const childrenChanges = diffChildren(
        currentVirtualNode.props.children,
        progressVirtualNode.props.children
      );

      if (childrenChanges.length > 0) {
        return {
          type: "UPDATE",
          children: childrenChanges,
        };
      }
    }

    return { type: "NO_CHANGE" };
  }

  // HTML 노드 처리
  const currentVirtualHTMLNode = currentVirtualNode as HTMLNode;
  const progressVirtualHTMLNode = progressVirtualNode as HTMLNode;

  const propsChanges = diffProps(
    currentVirtualNode.props,
    progressVirtualNode.props
  );

  const childrenChanges = diffChildren(
    currentVirtualHTMLNode.props.children!,
    progressVirtualHTMLNode.props.children!
  );

  if (propsChanges.length > 0 || childrenChanges.length > 0) {
    return {
      type: "UPDATE",
      props: propsChanges,
      children: childrenChanges,
    };
  }

  return { type: "NO_CHANGE" };
};

const diffProps = (oldProps: Props, newProps: Props): PropChange[] => {
  const changes: PropChange[] = [];

  // 제거되거나 변경된 속성 확인
  for (const [key, value] of Object.entries(oldProps)) {
    const oldValue = value;
    const newValue = newProps[key];

    if (key === "children") {
      continue;
    }

    if (!(key in newProps)) {
      // 제거된 속성 확인
      changes.push({ type: "REMOVE_PROP", key });
      continue;
    }

    if (!Object.is(newValue, oldValue)) {
      // 값이 변경된 경우
      // console.log("old : " + oldValue, "new : " + newValue);
      changes.push({ type: "SET_PROP", key, value: newValue });
    }
  }

  // 추가된 속성 확인
  for (const key of Object.keys(newProps)) {
    if (key === "children") {
      continue;
    }

    if (!(key in oldProps)) {
      // 추가된 속성 확인
      changes.push({ type: "SET_PROP", key, value: newProps[key] });
    }
  }

  return changes;
};

const flattenChildren = (
  children: VirtualNode | VirtualNode[]
): VirtualNode[] => {
  const flattened: VirtualNode[] = [];
  const toFlatten = Array.isArray(children) ? children : [children];

  for (const child of toFlatten) {
    if (!child) {
      continue;
    }

    if (child.type === "fragment") {
      flattened.push(...flattenChildren(child.props.children!));
      continue;
    }

    flattened.push(child);
  }

  return flattened;
};

const diffChildren = (
  oldChildren: VirtualNode | VirtualNode[],
  newChildren: VirtualNode | VirtualNode[]
): ChildChange[] => {
  const changes: ChildChange[] = [];
  const flattenedOldChildren = flattenChildren(oldChildren);
  const flattenedNewChildren = flattenChildren(newChildren);
  const maxLength = Math.max(
    flattenedOldChildren.length,
    flattenedNewChildren.length
  );

  for (let i = 0; i < maxLength; i++) {
    const oldChild = flattenedOldChildren[i];
    const newChild = flattenedNewChildren[i];

    if (!oldChild && newChild) {
      changes.push({ type: "ADD_CHILD", node: newChild, index: i });
      continue;
    }

    if (oldChild && !newChild) {
      changes.push({ type: "REMOVE_CHILD", index: i });
      continue;
    }

    if (oldChild && newChild) {
      const childDiff = reconcile(oldChild, newChild);
      if (childDiff.type !== "NO_CHANGE") {
        changes.push({ type: "UPDATE_CHILD", change: childDiff, index: i });
      }
    }
  }

  return changes;
};
