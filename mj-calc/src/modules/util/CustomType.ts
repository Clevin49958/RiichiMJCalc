import { NP } from "./Wind";

export type ArrayType<N extends NP, V> = N extends 2
  ? [V, V]
  : N extends 3
  ? [V, V, V]
  : [V, V, V, V];

export type NArrayType<N extends NP, A, B, C, D> = N extends 2
  ? [A, B]
  : N extends 3
  ? [A, B, C]
  : [A, B, C, D];

export type NUnionType<N extends NP, A, B, C, D> = N extends 2
  ? A | B
  : N extends 3
  ? A | B | C
  : A | B | C | D;
