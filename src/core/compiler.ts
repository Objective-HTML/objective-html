import { Node } from 'interfaces/node';
import Parser from './parser';

export default class Compiler {
  private ast: Node;

  private code: string[] = [];

  private output: string = this.code.join('\n');

  constructor(code: string) {
    const parser: Parser = new Parser(code);
    this.ast = parser.parse();
  }

  // eslint-disable-next-line class-methods-use-this
  private async resolveModule(path: string) {
    return path;
  }

  public async compile(): Promise<string> {
    return this.output;
  }
}
