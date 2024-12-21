import {
  HTMLTagName,
  Children,
  HTMLNode,
  Props,
  FragmentNode,
  TextNode,
  SingleChild,
  OnlyKeyProps,
} from "../types";

// React에서 무시되는 값 체크
const isIgnoreValue = (value: any): boolean => {
  const valueType = typeof value;
  if (valueType === "undefined" || valueType === "boolean") {
    return true;
  }

  if (valueType === "object" && value === null) {
    return true;
  }

  return false;
};

export const createElement = (
  type: HTMLTagName | Function, // HTML 태그, 함수형 컴포넌트, Fragment
  config: Props | null, // 요소의 속성들(HTML 어트리뷰트, key, ref 등등)
  ...children: Children // Node, TextNode 형태의 배열
): HTMLNode => {
  // 함수형 컴포넌트, Fragment 처리
  if (typeof type === "function") {
    return type({ ...config, children });
  }

  // 텍스트 노드 처리
  const childrenNodeList = children
    .filter((child) => !isIgnoreValue(child))
    .map((child) =>
      typeof child === "string" || typeof child === "number"
        ? createTextElement(child)
        : child
    );

  return {
    type,
    props: {
      ...config,
      // 처리 할 자식이 있다면 children 속성 생성(자식이 없는 경우는 속성 제거)
      ...(childrenNodeList.length > 0 && {
        children:
          childrenNodeList.length === 1
            ? (childrenNodeList[0] as SingleChild)
            : childrenNodeList,
      }),
    },
  };
};

const createTextElement = (text: string | number): TextNode => {
  return {
    type: "textNode",
    props: {
      text,
    },
  };
};

export const Fragment = (props: OnlyKeyProps): FragmentNode => {
  const childrenNodeList = (props.children as Children)
    .filter((child) => !isIgnoreValue(child))
    .map((child) =>
      typeof child === "string" || typeof child === "number"
        ? createTextElement(child)
        : child
    );

  delete props.children;
  return {
    type: "fragment",
    props: {
      ...props,
      ...(childrenNodeList.length > 0 && {
        children:
          childrenNodeList.length === 1
            ? (childrenNodeList[0] as SingleChild)
            : childrenNodeList,
      }),
    },
  };
};
