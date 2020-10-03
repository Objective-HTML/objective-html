import { Node } from 'interfaces/node';

export default class Parser {
  private ast: Node = {
    type: 'Program',
    body: [],
    value: '',
  };

  constructor(private readonly code: string) {}

  public parse(chars: string, index: number, ast: Node): Node {
    console.log(chars);
    return this.ast;
  }
}