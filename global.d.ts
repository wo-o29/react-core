// 전역 선언 파일 설정
declare namespace JSX {
  interface IntrinsicElements {
    // HTML 태그들의 타입 정의
    [elementName: string]: any;
  }
}

declare function createElement(
  type: HTMLTagName | Function,
  props: Props | null,
  ...children: Children
): HTMLNode;
declare function Fragment(props: Props): PropsWithChildren;
