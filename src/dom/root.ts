import { VirtualNode, HTMLNode } from "../types";
import SyntheticEvent from "../event/SyntheticEvent";
import { camelCaseToSnakeCase } from "../util/converter";

// WeakMap을 사용하여 DOM 요소와 VirtualNode를 연결(객체에 대한 참조가 없을 경우 가바지 컬렉션에 의해 자동으로 제거)
const elementToVirtualNode = new WeakMap<Element, VirtualNode>();

export const createRoot = (
  container: Element | Document | DocumentFragment,
  rootElement: VirtualNode
) => {
  const root = render(rootElement); // 가상 DOM -> 실제 DOM 렌더링
  container.appendChild(root); // 컨테이너에 추가
  attachEventListeners(rootElement, container); // 이벤트 연결(이벤트 위임 방식)
};

const render = (node: VirtualNode): Node => {
  if (node.type === "textNode") {
    // 텍스트 노드 처리
    return document.createTextNode(node.props.text.toString());
  }

  if (node.type === "fragment") {
    // Fragment 처리
    const fragment = document.createDocumentFragment();

    if (Array.isArray(node.props.children)) {
      // 자식이 여러개인 경우
      node.props.children.forEach((child) => {
        fragment.appendChild(render(child));
      });
    } else if (node.props.children) {
      // 단일 자식인 경우
      fragment.appendChild(render(node.props.children));
    }

    return fragment;
  }

  // 일반 DOM(HTML 태그) 처리
  const element = document.createElement(node.type);
  elementToVirtualNode.set(element, node); // 실제 DOM 요소와 VirtualNode 연결

  // 속성 처리
  Object.entries(node.props).forEach(([key, value]) => {
    if (key === "children" || key.startsWith("on")) {
      // children, 이벤트 핸들러 제외
      return;
    }

    if (key === "className") {
      // 클래스 처리
      element.setAttribute("class", value);
      return;
    }

    // 일반 속성 설정
    element.setAttribute(key, value);
  });

  if ("style" in node.props) {
    const style = node.props.style as CSSStyleDeclaration;
    Object.entries(style).forEach(([key, value]) => {
      element.style.setProperty(camelCaseToSnakeCase(key), value);
    });
  }

  // 자식 요소 렌더링
  if (Array.isArray(node.props.children)) {
    // 자식이 여러개인 경우
    node.props.children.forEach((child) => {
      element.appendChild(render(child));
    });
  } else if (node.props.children) {
    // 단일 자식인 경우
    element.appendChild(render(node.props.children));
  }

  return element;
};

const uniqueEvent = new Set();

const attachEventListeners = (
  node: VirtualNode, // 가상 DOM
  container: Element | Document | DocumentFragment
) => {
  if (node.props === null || node.type === "textNode") {
    // props가 없거나(이벤트가 없음) 텍스트 노드인 경우 early return
    return;
  }

  const handleEvent = (nativeEvent: Event, VirtualNodeEventName: string) => {
    // 네이티브 DOM 이벤트를 래핑하는 SyntheticEvent 객체 생성
    const syntheticEvent = new SyntheticEvent(nativeEvent);
    // 이벤트가 발생한 실제 DOM 요소
    let currentTarget = nativeEvent.target as Element | null;

    while (currentTarget && currentTarget !== container) {
      // 이벤트 타겟부터 부모 요소로 올라가면서 각 요소 검사(컨테이너, 더 이상 부모 요소가 없을 때 까지)

      // 가상 DOM 노드
      const virtualNode = elementToVirtualNode.get(currentTarget) as HTMLNode;
      const handler = virtualNode.props[VirtualNodeEventName]; // 실제 이벤트 핸들러 함수
      if (typeof handler === "function") {
        // syntheticEvent의 currentTarget에 현재 이벤트가 처리되고 있는 요소 설정
        syntheticEvent.currentTarget = currentTarget;
        handler(syntheticEvent); // 이벤트 핸들러 함수 실행

        if (syntheticEvent.isPropagationStopped) {
          // 이벤트 핸들러에서 stopPropagation를 호출하였다면 버블링 중지
          break;
        }
      }

      // 부모 요소로 이동
      currentTarget = currentTarget.parentElement;
    }
  };

  // 이벤트 핸들러 연결(컨테이너에 연결, 이벤트 위임 방식)
  Object.entries(node.props).forEach(([key, value]) => {
    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.toLowerCase().substring(2);
      if (uniqueEvent.has(eventName)) {
        // 이미 해당 이벤트가 등록되어 있는 경우(이벤트 위임 방식이기 때문에 같은 이벤트를 등록하지 않아도 됨)
        return;
      }

      container.addEventListener(eventName, (e) => handleEvent(e, key));
      uniqueEvent.add(eventName);
    }
  });

  // 자식 요소들 이벤트 핸들러 처리
  if (Array.isArray(node.props.children)) {
    // 자식이 여러개인 경우
    node.props.children.forEach((child) =>
      attachEventListeners(child, container)
    );
  } else if (node.props.children) {
    // 단일 자식인 경우
    attachEventListeners(node.props.children, container);
  }
};
