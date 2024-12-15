// children 타입(HTML, Text)
export type Children = (HTMLNode | TextNode)[];

// props
export interface Props {
  [key: string]: any;
}

// props + children 객체
export interface PropsWithChildren extends Props {
  children: Children;
}

// HTML Node
export interface HTMLNode {
  type: string;
  props: PropsWithChildren;
}

// Text Node
export interface TextNode {
  type: "textNode";
  text: string;
}

// Fragment Node
export interface FragmentNode {
  type: "fragment";
  props: PropsWithChildren;
}
