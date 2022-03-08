import { ComponentConstructor } from "../../../lib/@types/ComponentConstructor.type";
import Component from "../../../lib/template/Component.template";
import { TodoListConstructor, TodoListState } from "./types";

class TodoList extends Component<TodoListState> {
  handleCreate: () => void;
  handleToggle: EventListener;

  constructor({
    $target,
    initialState,
    onCreate,
    onToggle,
  }: TodoListConstructor) {
    super({ $target, initialState, className: "todoList" });

    this.$node = document.createElement("div");

    this.handleCreate = () => {
      onCreate?.();
    };
    this.handleToggle = (e) => {
      if (
        e.target instanceof Element &&
        e.target.classList.contains("done_btn")
      ) {
        const $li = e.target.closest("li");
        if (!$li) return;

        const {
          dataset: { id },
        } = $li;
        onToggle?.(Number(id));
      }
    };
  }

  template(): string {
    const { todos } = this.$state;

    return `
        <ul>
          ${todos
            .map(
              ({ todo, done }, index) =>
                `<li ${done ? `class="done"` : ""} data-id="${index}">${todo}
                  <button class="done_btn">✓</button>
                </li>`
            )
            .join("")}
        </ul>
        <button class="create_btn">Create Todo!</button>
      `;
  }

  setEvent(): void {
    this.$node
      .querySelector(".create_btn")
      ?.addEventListener("click", this.handleCreate);
    this.$node
      .querySelector("ul")
      ?.addEventListener("click", this.handleToggle);
  }

  clearEvent(): void {
    this.$node
      .querySelector(".create_btn")
      ?.removeEventListener("click", this.handleCreate);
    this.$node
      .querySelector("ul")
      ?.removeEventListener("click", this.handleToggle);
  }
}

export default TodoList;
