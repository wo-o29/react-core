import { VirtualNode, HTMLNode, SingleChild, Children } from "../types";
import SyntheticEvent from "../event/SyntheticEvent";
import { camelCaseToKebabCase } from "../util/converter";
import { ChildChange, DiffResult, PropChange, reconcile } from "./reconcile";
import { resetHooks } from "../hooks/hooks";
import App from "../App";

// WeakMap을 사용하여 DOM 요소와 VirtualNode를 연결(객체에 대한 참조가 없을 경우 가바지 컬렉션에 의해 자동으로 제거)
let elementToVirtualNode = new WeakMap<Element, VirtualNode>();
const uniqueEvent = new Set();
export let currentVirtualNode: VirtualNode | null = null;

export const createRoot = (
  container: Element | Document | DocumentFragment,
  rootElement: VirtualNode
) => {
  elementToVirtualNode = new WeakMap<Element, VirtualNode>();
  const root = render(rootElement); // 가상 DOM -> 실제 DOM 렌더링
  currentVirtualNode = rootElement;
  container.appendChild(root); // 컨테이너에 추가
  uniqueEvent.clear();
  attachEventListeners(rootElement, container); // 이벤트 연결(이벤트 위임 방식)
};

const processChildren = (
  children: SingleChild | Children,
  processFn: (child: SingleChild) => void
) => {
  if (Array.isArray(children)) {
    children.forEach((child) => {
      processFn(child);
    });
    return;
  }

  processFn(children);
};

export const render = (node: VirtualNode): Node => {
  if (node.type === "textNode") {
    // 텍스트 노드 처리
    return document.createTextNode(node.props.text.toString());
  }

  if (node.type === "fragment") {
    // Fragment 처리
    const fragment = document.createDocumentFragment();

    if (node.props.children) {
      processChildren(node.props.children, (child) =>
        fragment.appendChild(render(child))
      );
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
    Object.entries(node.props.style!).forEach(([key, value]) => {
      element.style.setProperty(camelCaseToKebabCase(key), value);
    });
  }

  if (node.props.children) {
    processChildren(node.props.children, (child) =>
      element.appendChild(render(child))
    );
  }

  return element;
};

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
      if (!virtualNode) {
        break;
      }

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

  if (node.props.children) {
    processChildren(node.props.children, (child) =>
      attachEventListeners(child, container)
    );
  }
};

export const updateSchedule = () => {
  const app = document.getElementById("app");
  resetHooks();
  const diff = reconcile(currentVirtualNode!, App());
  applyDiff(diff, app!);
};

export const applyDiff = (diff: DiffResult, node: HTMLElement | Text) => {
  // 변경사항이 없는 경우 함수 종료
  if (diff.type === "NO_CHANGE") {
    return;
  }

  // 노드를 완전히 교체해야 하는 경우
  if (diff.type === "REPLACE") {
    // 부모 노드가 없으면 교체할 수 없으므로 함수 종료
    if (!node.parentNode) {
      return;
    }

    // 새 노드를 렌더링
    const newNode = render(diff.node);
    // 기존 노드를 새 노드로 교체
    node.parentNode.replaceChild(newNode, node);
    return;
  }

  // 텍스트 노드의 내용을 업데이트해야 하는 경우
  if (diff.type === "UPDATE_TEXT") {
    // 노드가 Text 인스턴스가 아니면 함수 종료
    if (!(node instanceof Text)) {
      return;
    }

    // 텍스트 노드의 내용을 새 텍스트로 업데이트
    node.nodeValue = diff.text.toString();
    return;
  }

  // UPDATE 타입이 아닌 경우 함수 종료
  if (diff.type !== "UPDATE") {
    return;
  }

  // 속성 변경사항이 있는 경우 처리
  if (diff.props) {
    applyPropChanges(node as HTMLElement, diff.props);
  }

  // 자식 노드 변경사항이 있는 경우 처리
  if (diff.children) {
    applyChildChanges(node as HTMLElement, diff.children);
  }
};

const applyPropChanges = (node: HTMLElement, propChanges: PropChange[]) => {
  // 각 속성 변경사항에 대해 처리
  propChanges.forEach((propChange) => {
    const { type, key } = propChange;

    // 속성을 제거해야 하는 경우
    if (type === "REMOVE_PROP") {
      node.removeAttribute(key);
      return;
    }

    // className 속성 처리 (class로 변환)
    if (key === "className") {
      node.setAttribute("class", propChange.value);
      return;
    }

    // style 속성 처리
    if (key === "style") {
      applyStyleChanges(node, propChange.value);
      return;
    }

    // 그 외 일반 속성 처리
    node.setAttribute(key, propChange.value);
  });
};

const applyStyleChanges = (
  node: HTMLElement,
  styleChanges: Record<string, string>
) => {
  // 각 스타일 속성에 대해 처리
  Object.entries(styleChanges).forEach(([key, value]) => {
    node.style.setProperty(camelCaseToKebabCase(key), value);
  });
};

const applyChildChanges = (node: HTMLElement, childChanges: ChildChange[]) => {
  console.log(childChanges);
  childChanges.forEach((childChange) => {
    const { type, index } = childChange;

    // 자식 노드 추가
    if (type === "ADD_CHILD") {
      const newChildNode = render(childChange.node);
      if (index < node.childNodes.length) {
        // 지정된 인덱스에 새 노드 삽입
        node.insertBefore(newChildNode, node.childNodes[index]);
        return;
      }

      //  마지막에 추가
      node.appendChild(newChildNode);
      return;
    }

    // 자식 노드 제거
    if (type === "REMOVE_CHILD") {
      if (index < node.childNodes.length) {
        // 지정된 인덱스에 노드 제거
        node.removeChild(node.childNodes[3]);
      }

      return;
    }

    // UPDATE_CHILD, 자식 노드 업데이트
    if (index < node.childNodes.length) {
      // 재귀적으로 applyDiff 호출하여 자식 노드 업데이트
      applyDiff(
        childChange.change,
        node.childNodes[index] as HTMLElement | Text
      );
    }
  });
};
