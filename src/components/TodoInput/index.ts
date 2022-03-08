import { ComponentConstructor } from "../../../lib/@types/ComponentConstructor.type";
import Component from "../../../lib/template/Component.template";
import { TodoInputConstructor, TodoInputState } from "./types";

const defaultState = {
  placeholder: "",
  value: "",
  type: "text",
  required: false,
};

class TodoInput extends Component<TodoInputState> {
  handleSubmit: EventListener;
  handleChange: EventListener;
  constructor({ $target, initialState }: TodoInputConstructor) {
    super({
      $target,
      initialState: { ...defaultState, ...initialState },
      className: "todoInput",
    });

    this.$node = document.createElement("input");

    this.handleChange = (e) => {
      if (e.target instanceof HTMLInputElement) {
        this.setState({ value: e.target.value });
      }
    };
  }

  beforeRender(): void {}

  setEvent(): void {
    this.$node
      .querySelector("input")
      ?.addEventListener("input", this.handleChange);
  }

  clearEvent(): void {
    this.$node
      .querySelector("input")
      ?.removeEventListener("input", this.handleChange);
  }
}

export default TodoInput;
