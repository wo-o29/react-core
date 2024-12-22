// HTML 태그만 모아놓은 타입
export type HTMLTagName = keyof HTMLElementTagNameMap;

// 단일 자식
export type SingleChild = HTMLNode | TextNode | FragmentNode;

// children 배열 타입
export type Children = SingleChild[];

// props
export interface Props {
  [key: string]: any;
}

// props + children 객체
export interface PropsWithChildren extends Props {
  children?: Children;
}

export interface HTMLProps extends PropsWithChildren {
  style?: CSSStyleDeclaration;
}

// HTML Node
export interface HTMLNode {
  type: HTMLTagName;
  props: HTMLProps;
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
  props: OnlyKeyProps;
}

type Key = string | number | bigint;

export interface OnlyKeyProps {
  key?: Key | null;
  children?: Children;
}

export type VirtualNode = FragmentNode | HTMLNode | TextNode;
