// 전역 선언 파일 설정

type HTMLTagName = keyof HTMLElementTagNameMap;
declare namespace JSX {
  type IntrinsicElements = {
    [K in HTMLTagName]: any;
  };
}

declare function createElement(
  type: HTMLTagName | Function,
  props: Props | null,
  ...children: Children
): HTMLNode;
declare function Fragment(props: Props): PropsWithChildren;
