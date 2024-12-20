class SyntheticEvent {
  nativeEvent: Event; // 네이티브 이벤트(브라우저에서 발생한 실제 이벤트)
  type: string; // 이벤트 유형(ex. click, keydown 등)
  target: EventTarget | null; // 이벤트가 발생한 요소
  currentTarget: EventTarget | null; // 현재 이벤트가 발생한 요소(실제 이벤트 처리할 때 갱신)
  isDefaultPrevented: boolean; // 기본 동작이 방지되었는지 확인
  isPropagationStopped: boolean; // 이벤트 전파가 중단되었는지 확인

  constructor(nativeEvent: Event) {
    this.nativeEvent = nativeEvent;
    this.type = nativeEvent.type;
    this.target = nativeEvent.target;
    this.currentTarget = null;
    this.isDefaultPrevented = false;
    this.isPropagationStopped = false;
  }

  preventDefault() {
    this.isDefaultPrevented = true;
    this.nativeEvent.preventDefault();
  }

  stopPropagation() {
    this.isPropagationStopped = true;
    this.nativeEvent.stopPropagation();
  }
}

export default SyntheticEvent;
