import { ComponentConstructor } from "../../../lib/@types/ComponentConstructor.type";

export interface InputState {
  placeholder?: string;
  value?: string;
  type?: string;
  required?: boolean;
}

export interface InputConstructor extends ComponentConstructor<InputState> {
  onInput?: (value: string) => any;
}
