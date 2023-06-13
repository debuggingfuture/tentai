// ucan
export type URI = string;
export type Ability = string;

export interface Closure {
  with: URI;
  do: Ability;
  inputs: any;
}

export interface Task {
  with: URI;
  do: Ability;
  inputs: any;
  meta?: Record<string, any>;
}
