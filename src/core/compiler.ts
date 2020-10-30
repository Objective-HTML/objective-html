import { Node } from 'interfaces/parser/node';
import { Parameters } from 'interfaces/compiler/parameters';
import { promises as fs } from 'fs';
import { Block } from 'interfaces/parser/block';
import { get } from 'src/block';
import { getLanguage } from 'src/language';
import * as Path from 'path';
import Parser from './parser';

export default class Compiler {
  private readonly ast: Node;

  private readonly parser: Parser;

  private code: string[] = [];

  private output: string = this.code.join('\n');

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

  private Javascript(ast: Node) {
    if (ast.body) {
      ast.body.map((child: Node): Boolean => {
        const block: Block = child.block || {
          name: '',
          params: [],
        };
        if (block.name === 'objective' && get(block, 'namespace').length > 0) {
          this.output += `function ${get(block, 'namespace')[0].value}() {`;
        }
        if (block.name === 'print') {
          this.output += 'console.log(';
        }
        if (child.type === 'Text') this.output += `"${child.value}"`;
        this.Javascript(child);
        if (block.name === 'print') {
          this.output += ');';
        }
        if (block.name === 'objective' && get(block, 'namespace').length > 0) {
          this.output += `}\n${get(block, 'namespace')[0].value}();`;
        }
        return true;
      });
    }
  }

  public async compile(): Promise<string> {
    console.log(getLanguage(this.parameters));
    if (['js', 'javascript'].includes(this.parameters.output)) {
      this.Javascript(this.ast);
    }
    return this.output;
  }
}
