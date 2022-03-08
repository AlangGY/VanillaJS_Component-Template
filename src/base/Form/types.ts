import { ComponentConstructor } from "../../../lib/@types/ComponentConstructor.type";

export interface FormState {
  value: any;
  error: any;
  isLoading: boolean;
}

export interface FormConstructor extends ComponentConstructor<FormState> {
  onSubmit: (value: any) => any;
}
