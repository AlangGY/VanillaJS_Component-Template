import { ComponentConstructor } from "../../../lib/@types/ComponentConstructor.type";

export interface TodoFormState {
  value: any;
  error: any;
  isLoading: boolean;
}

export interface TodoFormConstructor
  extends ComponentConstructor<TodoFormState> {
  onSubmit: (value: any) => void;
}
