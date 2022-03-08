import Component from "../../../lib/template/Component.template";
import { FormConstructor, FormState } from "./types";

const defaultState: FormState = {
  value: null,
  error: null,
  isLoading: false,
};

class Form extends Component<FormState> {
  handleSubmit: EventListener;

  constructor({ $target, initialState, className, onSubmit }: FormConstructor) {
    super({
      $target,
      initialState: { ...defaultState, ...initialState },
      className,
    });
    this.$node = document.createElement("form");

    this.handleSubmit = async (e) => {
      e.preventDefault();
      const { value } = this.$state;
      this.setState({ isLoading: true });
      await onSubmit?.(value);
    };
  }

  setEvent() {
    this.$node?.addEventListener("submit", this.handleSubmit);
  }

  clearEvent(): void {
    this.$node?.removeEventListener("submit", this.handleSubmit);
  }
}

export default Form;
