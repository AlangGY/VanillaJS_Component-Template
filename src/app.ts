import { ComponentConstructor } from "../lib/@types/ComponentConstructor.type";
import { ITodo } from "../lib/@types/types";
import Component from "../lib/template/Component.template";
import Counter from "./components/Counter";
import TodoCounter from "./components/TodoCounter";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";

class App extends Component<{
  todos: ITodo[];
  value?: string;
}> {
  constructor({ $target }: ComponentConstructor<{}>) {
    super({
      $target,
      initialState: { todos: [{ todo: "Hello" }] },
    });

    this.$children.set("counter", new Counter({ $target }));

    this.$children.set(
      "input",
      new TodoInput({
        $target: this.$target,
      })
    );

    this.$children.set(
      "todoCounter",
      new TodoCounter({
        $target: this.$target,
        initialState: { todos: this.$state.todos },
      })
    );

    this.$children.set(
      "todoList",
      new TodoList({
        $target: this.$target,
        initialState: { todos: this.$state.todos },
        onCreate: () => {
          this.setState({
            todos: [...this.$state.todos, { todo: "Hi Again!" }],
          });
        },
        onToggle: (id) => {
          const todos = this.$state.todos.map((todo, index) =>
            index === id ? { ...todo, done: !todo.done } : todo
          );
          this.setState({ todos });
        },
      })
    );
    this.subscribeState({
      targetState: "todos",
      subscriber: "todoCounter",
      subscriberStateKey: "todos",
    });
    this.subscribeState({
      targetState: "todos",
      subscriber: "todoList",
      subscriberStateKey: "todos",
    });
  }
}

export default App;
