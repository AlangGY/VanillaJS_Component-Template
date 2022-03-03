export interface ComponentConstructor<
  S extends { [value: string | symbol]: any },
  T extends Element = Element
> {
  $target: T;
  initialState?: S;
  className?: string;
  display?: boolean;
}
