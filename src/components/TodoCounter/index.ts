import { ComponentConstructor } from "../../../lib/@types/ComponentConstructor.type";
import { ITodo } from "../../../lib/@types/types";
import Component from "../../../lib/template/Component.template";

class TodoCounter extends Component<{ todos: ITodo[] }> {
  constructor({
    $target,
    initialState,
  }: ComponentConstructor<{ todos: ITodo[] }>) {
    super({ $target, initialState, className: "todoCounter" });

    this.$node = document.createElement("div");
  }

  template(): string {
    const { todos } = this.$state;
    const todosLength = todos.length;
    const doneLength = todos.filter(({ done }) => done).length;
    return `
    <h3>Todo Counter</h3>
    <span>${doneLength} / ${todosLength}</span>
    `;
  }
}

export default TodoCounter;
