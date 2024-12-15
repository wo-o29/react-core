import {
  HTMLTagName,
  Children,
  HTMLNode,
  Props,
  FragmentNode,
  TextNode,
  SingleChild,
} from "./types";

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
  const childrenNodeList = children.map((child) =>
    typeof child === "string" ? createTextElement(child) : child
  );

  return {
    type,
    props: {
      ...config,
      // 자식이 여러 개이면 배열 처리, 1개면 단일 처리
      children:
        childrenNodeList.length === 1
          ? (childrenNodeList[0] as SingleChild)
          : childrenNodeList,
    },
  };
};

const createTextElement = (text: string): TextNode => {
  return {
    type: "textNode",
    text,
  };
};

export const Fragment = (props: Props): FragmentNode => {
  return { type: "fragment", props: { ...props, children: props.children } };
};
