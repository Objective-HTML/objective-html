import { Parameter } from './param';
import { Types } from './types';

export interface Node {
  type: Types,
  value: string,
  body?: Node[],
  parent?: Node,
  params: Parameter[]
}