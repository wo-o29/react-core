import {
  HTMLTagName,
  Children,
  HTMLNode,
  Props,
  FragmentNode,
  OnlyKeyProps,
} from "./src/types";

declare global {
  namespace JSX {
    type IntrinsicElements = {
      [K in HTMLTagName]: HTMLTagName[K];
    };
  }

  declare function createElement(
    type: HTMLTagName | Function,
    props: Props | null,
    ...children: Children
  ): HTMLNode;

  declare function Fragment(props: OnlyKeyProps): FragmentNode;
}
