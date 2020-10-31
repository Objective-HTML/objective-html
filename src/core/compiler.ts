import { Node } from 'interfaces/parser/node';
import { Parameters } from 'interfaces/compiler/parameters';
import { promises as fs } from 'fs';
import { getLanguage } from 'src/language';
import * as Path from 'path';
import Parser from './parser';

export default class Compiler {
  private readonly ast: Node;

  private readonly parser: Parser;

  private readonly parameters: Parameters;

  constructor(code: string, params: Parameters = { cwd: process.cwd(), output: 'js' }) {
    this.parameters = params;
    this.parser = new Parser(code);
    this.ast = this.parser.parse();
  }

  public get astRaw(): Node {
    return this.parser.rawAST();
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

  public async compile(): Promise<Boolean> {
    try {
      const language: string = getLanguage(this.parameters);
      const Module = (await import(Path.resolve(Path.join(process.cwd(), 'src', 'core', language, 'handler.ts')))).default;
      // eslint-disable-next-line no-new
      new Module(this.ast, this.parameters);
    } catch (exception) {
      throw new Error(exception);
    }
    return true;
  }
}
