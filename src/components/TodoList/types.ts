import { ComponentConstructor } from "../../../lib/@types/ComponentConstructor.type";
import { ITodo } from "../../../lib/@types/types";

export interface TodoListState {
  todos: ITodo[];
}

export interface TodoListConstructor
  extends ComponentConstructor<TodoListState> {
  onCreate?: () => void;
  onToggle?: (id: number) => void;
}
