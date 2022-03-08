import { ComponentConstructor } from "../../../lib/@types/ComponentConstructor.type";

export interface TodoInputState {
  placeholder?: string;
  value?: string;
  type?: string;
  required?: boolean;
}

export interface TodoInputConstructor
  extends ComponentConstructor<TodoInputState> {}
