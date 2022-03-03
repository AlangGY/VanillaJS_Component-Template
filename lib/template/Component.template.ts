import { ComponentConstructor } from "../@types/ComponentConstructor.type";

class Component<
  /* 
  T : $target type
  S : $node type
  S : state type
*/
  S extends { [value: string | symbol]: any } = {
    [value: string | symbol]: any;
  },
  T extends Element = Element,
  N extends Element = Element
> {
  _id: number;
  $target: T;
  $node: N;
  $props: { state: S; className?: string; display?: boolean };
  $children?: Component[];

  constructor({
    $target,
    initialState,
    className,
    display = true,
  }: ComponentConstructor<S, T>) {
    this.$target = $target;
    this.$props = new Proxy(
      { state: { ...initialState }, className, display },
      {
        // state 가 아닌 다른 키값을 조회할경우, props.state 프로퍼티 객체의 key:value를 반환한다.
        // 이를 통해 this.state.state.id 조회를 this.state.id 와 같은 직관적인 형태로 참조가 가능하다.
        get: (props, key) => {
          return key !== "state" ? props.state[key] : props.state;
        },
        // 대상 객체의 프로퍼티를 변경시, 이를 인터셉트하여 state 프로퍼티에 값을 담은 후, render() 메소드와 child 가 있다면 setChildrenState를 호출한다.
        // getter와 마찬가지로 직간적인 형태로 상태값을 변경하기위해, key !== state 인경우, stateProxy.state[key] 에 값을 할당한다.
        // 이를 통해, this.state.state.id = "id"와 같은 값 할당을, this.state.id = "id"와 같은 직관적인 형태로 할당이 가능하다.
        // 복수의 상태값을 변경하려면, this.state.state 에 객체를 할당한다.
        set: (props, key, value) => {
          const prevProps = { ...props };
          if (key === "state") {
            props.state = { ...props.state, ...value };
          } else if (key === "className" && props.className !== value) {
            props.className = value;
          } else if (key === "display" && props.display !== value) {
            props.display = value;
          } else {
            // props[key] 대신 props.state[key] 에 값을 할당한다.
            props.state = { ...props.state, [key]: value };
          }
          // children이 있으면 setChildrenState를 호출한다.
          this.$children && this.setChildrenState(props.state);
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
    this.beforeRender();
    const template = this.template();
    const { display } = this.$props;
    if (!display) {
      this.$node.setAttribute("style", "display: none;");
    }
    // render 이전에, 수행할 메소드 실행
    this.beforeRender();
    // 만약 template이 존재하지 않으면, render 할 필요가 없다. (child의 경우는 proxy의 setter로 인해 각자의 render 메서드가 호출된다.)
    if (!template) return;

    // innerHTML이 수정되므로, 그 이전에 부착되어있던 children 들을 unMount 시킨다.
    this.$children?.map((ChildComponent) => ChildComponent.unMount());
    if (this.$node) {
      this.clearEvent();
      this.$node.innerHTML = template;
      this.setEvent();
    }
    // innerHTML 갱신이 완료된후, children 들을 mount 시킨다.
    this.$children?.map((ChildComponent) => ChildComponent.mount());

    this.afterRender();
  }

  setChildrenState(newState: S) {
    // newState 를 순회하며, 각 children이 사용하는 상태만 골라서 setState한다.
    // 상태값을 custom 하게 변경하려면, 상속받은 컴포넌트 클래스에서 setChildrenState overRide 하여 작성해야한다.
    this.$children?.forEach((ChildComponent) => {
      const newChildState = Object.entries(newState)
        .filter(([key]) => ChildComponent.$props.state.hasOwnProperty(key))
        .reduce<{ [value: string | symbol]: any }>(
          (newObject, [key, value]) => {
            newObject[key] = value;
            return newObject;
          },
          {}
        );
      ChildComponent.$props.state = newChildState;
    });

    return this;
  }

  mount() {
    this.$children?.forEach((ChildComponent) => ChildComponent.mount());
    this.setEvent();
    this.render();
    this.$node && this.$target.appendChild(this.$node);

    return this;
  }

  unMount() {
    this.clearEvent();
    this.$node && this.$target.removeChild(this.$node);
    return this;
  }

  setEvent() {}

  clearEvent() {}
}

export default Component;
