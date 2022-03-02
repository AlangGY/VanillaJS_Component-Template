interface ComponentConstructor<
  T extends Node,
  S extends { [value: string | symbol]: any }
> {
  $target: T;
  initialState?: S;
  className?: string;
}
class Component<
  /* 
  T : $target type
  S : $node type
  S : state type
*/
  T extends Node = Node,
  N extends Node = Node,
  S extends { [value: string | symbol]: any } = {
    [value: string | symbol]: any;
  }
> {
  _id: number;
  $target: T;
  $node: N;
  $props: { state: S };
  $className: string;
  $children: Node[];

  constructor({
    $target,
    initialState,
    className,
  }: ComponentConstructor<T, S>) {
    this.$target = $target;
    this.$className = className;
    this.$props = new Proxy(
      { state: { ...initialState }, className },
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
          if (key === "state") {
            props.state = { ...props.state, ...value };
          } else if (key === "className") {
            props.className = value;
          } else {
            // props[key] 대신 props.state[key] 에 값을 할당한다.
            props.state = { ...props.state, [key]: value };
          }
          // children이 있으면 setChildrenState를 호출한다.
          this.$children && this.setChildrenState(props.state);

          return true;
        },
      }
    );
  }

  template() {
    return "";
  }

  beforeUpdate() {}

  render() {}

  setChildrenState(newState: S) {}

  mount() {}

  unMount() {}

  setEvent() {}

  clearEvent() {}
}
