import { Children, HTMLNode, Props, FragmentNode, TextNode } from "./types";

export const createElement = (
  type: string | Function, // HTML 태그, 함수형 컴포넌트, Fragment
  props: Props | null, // 어트리뷰트(id, onClick 등)
  ...children: Children // Node, TextNode 형태의 배열
): HTMLNode => {
  // 함수형 컴포넌트, Fragment 처리
  if (typeof type === "function") {
    return type({ ...props, children });
  }

  // HTML 태그 처리
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "string" ? createTextElement(child) : child
      ),
    },
  };
};

const createTextElement = (text: string): TextNode => {
  return {
    type: "textNode",
    props: {
      nodeValue: text,
    },
  };
};

export const Fragment = (props: Props): FragmentNode => {
  return { type: "fragment", props: { ...props, children: props.children } };
};
