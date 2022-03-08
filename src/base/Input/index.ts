import { ComponentConstructor } from "../../../lib/@types/ComponentConstructor.type";
import Component from "../../../lib/template/Component.template";
import { InputConstructor, InputState } from "./types";

const defaultState = {
  placeholder: "",
  value: "",
  type: "text",
  required: false,
};

class Input extends Component<InputState> {
  handleChange: EventListener;
  constructor({ $target, initialState, className, onInput }: InputConstructor) {
    super({
      $target,
      initialState: { ...defaultState, ...initialState },
      className,
    });

    this.$node = document.createElement("input");

    this.handleChange = (e) => {
      if (e.target instanceof HTMLInputElement) {
        this.setState({
          value: e.target.value,
        });
        onInput?.(e.target.value);
      }
    };
  }

  beforeRender(): void {
    const { placeholder, value, type, required } = this.$state;
    if (this.$node instanceof HTMLInputElement) {
      this.$node.type = type;
      this.$node.placeholder = placeholder;
      this.$node.value = value;
      this.$node.required = required;
    }
  }

  setEvent(): void {
    this.$node?.addEventListener("input", this.handleChange);
  }

  clearEvent(): void {
    this.$node?.removeEventListener("input", this.handleChange);
  }
}

export default Input;
