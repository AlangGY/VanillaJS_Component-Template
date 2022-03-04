import { ComponentConstructor } from "../../../lib/@types/ComponentConstructor.type";
import Component from "../../../lib/template/Component.template";
import { CounterState } from "./types";

class Counter extends Component<CounterState> {
  constructor({
    $target,
    initialState = { count: 0 },
    display = true,
  }: ComponentConstructor<CounterState>) {
    super({ $target, initialState, className: "counter", display });
    this.$node = document.createElement("div");
  }

  handleIncrease(): void {
    const { count } = this.$props.state;
    this.$props.state = { count: count + 1 };
  }

  handleDecrease(): void {
    const { count } = this.$props.state;
    this.$props.state = { count: count - 1 };
  }

  template(): string {
    const { count } = this.$props.state;
    return `
      <h3>Counter</h3>
      ${count}
      <button class="inc">Increase</button>
      <button class="dec">Decrease</button>
      `;
  }

  setEvent(): void {
    this.$node
      .querySelector(".inc")
      ?.addEventListener("click", this.handleIncrease.bind(this));
    this.$node
      .querySelector(".dec")
      ?.addEventListener("click", this.handleDecrease.bind(this));
  }

  clearEvent(): void {
    this.$node
      .querySelector(".inc")
      ?.removeEventListener("click", this.handleIncrease);
    this.$node
      .querySelector(".dec")
      ?.removeEventListener("click", this.handleDecrease);
  }
}

export default Counter;
