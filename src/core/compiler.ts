import { Node } from 'interfaces/parser/node';
import { Parameters } from 'interfaces/compiler/parameters';
import { promises as fs } from 'fs';
import * as Path from 'path';
import Parser from './parser';

export default class Compiler {
  private readonly ast: Node;

  private code: string[] = [];

  private output: string = this.code.join('\n');

  private readonly parameters: Parameters;

  constructor(code: string, params: Parameters = { cwd: process.cwd() }) {
    this.parameters = params;
    const parser: Parser = new Parser(code);
    this.ast = parser.parse();
  }

  // eslint-disable-next-line class-methods-use-this
  private async resolveModule(path: string): Promise<string> {
    const modulePath: string = Path.join(this.parameters.cwd, path);
    try {
      const content: string = await fs.readFile(modulePath, 'utf-8');
      return content;
    } catch (exception) {
      throw new Error(exception);
    }
  }

  public async compile(): Promise<string> {
    return this.output;
  }
}
