import { ComponentConstructor } from "../@types/ComponentConstructor.type";

type IStateSubscribers = {
  [key: string]: {
    targetState: string | number | symbol;
    subscriberStateKey: string;
    compute?: (state: any[keyof any], prevState: any[keyof any]) => any;
  }[];
};

class Component<
  /* 
  S : $node type
  S : state type
*/
  S extends { [value: string | symbol]: any } = {
    [value: string | symbol]: any;
  },
  N extends Element = Element
> {
  $target: Element;
  $node: N;
  $state: S;
  $props: { className?: string; display?: boolean; [key: string]: any };
  $children: Map<string, Component>;
  $stateSubscribers: IStateSubscribers;

  constructor({
    $target,
    initialState,
    className,
    display = true,
  }: ComponentConstructor<S>) {
    this.$target = $target;
    this.$children = new Map();
    this.$state = { ...initialState };
    this.$stateSubscribers = {};
    this.$props = new Proxy<{
      className: string;
      display: boolean;
      [value: string | symbol]: any;
    }>(
      { className, display },
      {
        // state 가 아닌 다른 키값을 조회할경우, props.state 프로퍼티 객체의 key:value를 반환한다.
        // 이를 통해 this.state.state.id 조회를 this.state.id 와 같은 직관적인 형태로 참조가 가능하다.
        // 대상 객체의 프로퍼티를 변경시, 이를 인터셉트하여 state 프로퍼티에 값을 담은 후, render() 메소드와 child 가 있다면 setChildrenState를 호출한다.
        // getter와 마찬가지로 직간적인 형태로 상태값을 변경하기위해, key !== state 인경우, stateProxy.state[key] 에 값을 할당한다.
        // 이를 통해, this.state.state.id = "id"와 같은 값 할당을, this.state.id = "id"와 같은 직관적인 형태로 할당이 가능하다.
        // 복수의 상태값을 변경하려면, this.state.state 에 객체를 할당한다.
        set: (props, key, value) => {
          const prevProps = { ...props };
          props[key] = value;
          // children이 있으면 setChildrenState를 호출한다.
          // props 변경이 끝나고, 값의 변경이 감지되면 render 메소드를 호출한다.
          if (JSON.stringify(prevProps) !== JSON.stringify(props)) {
            this.render();
          }
          return true;
        },
      }
    );
  }

  template() {
    return "";
  }

  beforeRender() {}

  afterRender() {}

  render() {
    // render 이전에, beforeRender 메소드 호출
    this.beforeRender();
    const template = this.template();
    const { display, className } = this.$props;
    // className 적용
    if (className && this.$node) {
      this.$node.className = className;
    }
    if (!display && this.$node) {
      this.$node.setAttribute("style", "display: none;");
    }

    // 만약 template이 존재하지 않으면, render 할 필요가 없다. (child의 경우는 proxy의 setter로 인해 각자의 render 메서드가 호출된다.)
    if (template) {
      // innerHTML이 수정되므로, 그 이전에 부착되어있던 children 들을 unMount 시킨다.
      if (this.$node) {
        this.$children?.forEach((ChildComponent) => ChildComponent.unMount());
        this.clearEvent();
        this.$node.innerHTML = template;
        this.setEvent();
        // innerHTML 갱신이 완료된후, children 들을 mount 시킨다.
        this.$children?.forEach((ChildComponent) => ChildComponent.mount());
      }
    }

    // render 이후, afterRender 메소드 호출
    this.afterRender();
  }

  setState(newState: Partial<S>) {
    const prevState = this.$state;
    this.$state = { ...this.$state, ...newState };
    if (JSON.stringify(prevState) !== JSON.stringify(this.$state)) {
      this.render();
      // 구독자들이 있으면...
      Object.keys(this.$stateSubscribers).length &&
        this.setSubscribersState(this.$state, prevState);
    }
  }

  subscribeState({
    targetState,
    subscriber,
    subscriberStateKey,
    compute,
  }: {
    targetState: keyof S;
    subscriber: string;
    subscriberStateKey: any;
    compute?: (
      stateValue: S[typeof targetState],
      prevState: S[typeof targetState]
    ) => any;
  }) {
    if (this.$children.get(subscriber)) {
      this.$stateSubscribers[subscriber] = [
        ...(this.$stateSubscribers[subscriber] || []),
        {
          subscriberStateKey,
          targetState,
          compute,
        },
      ];
    }
  }

  setSubscribersState(newState: S, prevState: S) {
    // newState 를 순회하며, 각 children이 사용하는 상태만 골라서 setState한다.
    // 상태값을 custom 하게 변경하려면, 상속받은 컴포넌트 클래스에서 setSubscribersState overRide 하여 작성해야한다.
    for (const [subscriberName, subscribedState] of Object.entries(
      this.$stateSubscribers
    )) {
      const newChildState = subscribedState.reduce<{ [key: string]: any }>(
        (acc, { targetState, subscriberStateKey, compute }) => {
          acc[subscriberStateKey] =
            compute?.(newState[targetState], prevState[targetState]) ||
            newState[targetState];
          return acc;
        },
        {}
      );
      this.$children.get(subscriberName).setState(newChildState);
    }
  }

  beforeMount() {}

  mount() {
    this.$children?.forEach((ChildComponent) => ChildComponent.mount());
    this.render();
    this.setEvent();
    this.beforeMount();
    this.$node && this.$target.appendChild(this.$node);

    return this;
  }

  beforeUnMount() {}

  unMount() {
    console.log("unMount");
    this.beforeUnMount();
    this.clearEvent();
    this.$node && this.$target.removeChild(this.$node);
    return this;
  }

  setEvent() {}

  clearEvent() {}
}

export default Component;
