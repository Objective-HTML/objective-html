import { Block } from 'interfaces/parser/block';
import { Parameter } from 'interfaces/parser/param';

export function get(block: Block, paramName: string) {
  return block.params.filter((param: Parameter) => param.property === paramName);
}

export default {
  get,
};
