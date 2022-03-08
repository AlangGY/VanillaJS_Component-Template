import Component from "../../../lib/template/Component.template";
import { TodoFormConstructor, TodoFormState } from "./type";

class TodoForm extends Component<TodoFormState> {
  handleSubmit: EventListener;

  constructor({ $target, initialState, onSubmit }: TodoFormConstructor) {
    super({ $target, initialState });
    this.$node = document.createElement("form");

    this.handleSubmit = (e) => {
      e.preventDefault();
      const { value } = this.$state;

      onSubmit?.(value);
    };
  }

  setEvent() {
    this.$node?.addEventListener("submit", this.handleSubmit);
  }

  clearEvent(): void {
    this.$node?.removeEventListener("submit", this.handleSubmit);
  }
}

export default TodoForm;
