// HTML 태그만 모아놓은 타입
export type HTMLTagName = keyof HTMLElementTagNameMap;

// children 타입(HTMLNode, TextNode 요소로 이루어진 배열)
export type Children = SingleChild[];

// 단일 자식
export type SingleChild = HTMLNode | TextNode | FragmentNode;

// props
export interface Props {
  [key: string]: any;
}

// props + children 객체
export interface PropsWithChildren extends Props {
  children?: SingleChild | Children;
}

// HTML Node
export interface HTMLNode {
  type: HTMLTagName;
  props: PropsWithChildren;
}

// Text Node
export interface TextNode {
  type: "textNode";
  props: {
    text: string | number;
  };
}

// Fragment Node
export interface FragmentNode {
  type: "fragment";
  props: PropsWithChildren;
}
