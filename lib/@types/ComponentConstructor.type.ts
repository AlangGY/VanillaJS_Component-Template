export interface ComponentConstructor<
  S extends { [value: string | symbol]: any }
> {
  $target: Element;
  initialState?: S;
  className?: string;
  display?: boolean;
}
