import { Types } from './types';

export interface Node {
  type: Types,
  value: string,
  body?: [],
  parent: Node,
}