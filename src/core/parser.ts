import { Block } from 'interfaces/parser/block';
import { Current } from 'interfaces/parser/current';
import { Node } from 'interfaces/parser/node';
import { Parameter } from 'interfaces/parser/param';

export default class Parser {
  private ast: Node = {
    type: 'Program',
    value: '',
    body: [],
  };

  private current: Current = {
    block: '',
    state: '',
  };

  private rawAst: Node = {
    type: 'Program',
    value: '',
    body: [],
  };

  constructor(private readonly code: string) {
    this.code = this.code
      .split(/\r?\n/g)
      .map((x) => x.trim())
      .filter((x) => x.length > 0)
      .join('');
  }

  // eslint-disable-next-line class-methods-use-this
  private removeStrings(value: string): string {
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, value.length - 1);
    }
    return value;
  }

  public parseBlock(block: string): Block {
    const parametersBlock: Array<string> = block
      .split(/<(\/)?\w+/g)
      .slice(1)
      .join('')
      .split(/(\/)?>/g)[0]
      .trim()
      .match(/(\w+=)?(\w+|".*?")?/g)
      .filter((x: string) => x.length > 0);
    const parameters: Array<Parameter> = [];
    parametersBlock.map((parameter: string): Boolean => {
      const splitted: Array<string> = parameter
        .split('=')
        .filter((x: string) => x.length > 0);
      if (parameter.includes('=') && splitted.length === 1) throw new Error(`Attribute value is not specified in "${splitted[0]}" property.`);
      parameters.push({
        property: splitted[0],
        value: this.removeStrings(splitted[1]).split(/\s+/g) ?? null,
      });
      return true;
    });
    const name: string = block
      .match(/<\w+/g)[0]
      .slice(1);
    return {
      name,
      params: parameters,
    };
  }

  public parse(chars: string = this.code, index: number = 0, ast: Node = this.ast): Node | null {
    const char = chars[index];
    if (!char) return this.ast;
    if (char === '<') {
      if (this.current.state === 'TEXT') {
        ast.body.push({
          type: 'Text',
          value: this.current.block,
          parent: ast,
        });
      }
      this.current.state = 'BLOCK';
      this.current.block = char;
    } else if (this.current.state === 'BLOCK') {
      if (char === '>') {
        this.current.state = '';
        this.current.block += char;
        if (this.current.block[1] === '/') {
          const blockName: string = this.current.block.slice(2, this.current.block.length - 1);
          if (blockName !== ast.block.name) throw new Error(`Blocks <${ast.block.name}> and ${this.current.block} don't match.`);
          this.current.block = '';
          this.parse(chars, index + 1, ast.parent);
          return null;
        } if (this.current.block.slice(-2)[0] === '/') {
          ast.body.push({
            type: 'Block',
            value: this.current.block,
            block: this.parseBlock(this.current.block),
            parent: ast,
          });
          this.current.block = '';
          this.parse(chars, index + 1, ast);
          return null;
        }
        ast.body.push({
          type: 'Node',
          value: this.current.block,
          block: this.parseBlock(this.current.block),
          parent: ast,
          body: [],
        });
        this.current.block = '';
        this.parse(chars, index + 1, ast.body.slice(-1)[0]);
        return null;
      }
      this.current.block += char;
    } else {
      this.current.state = 'TEXT';
      this.current.block += char;
    }
    this.parse(chars, index + 1, ast);
    return this.ast;
  }

  public rawAST(ast: Node = this.ast, rawAst: Node = this.rawAst): Node | null {
    if (this.ast.body.length === 0) this.parse();
    if (!ast.body) return this.rawAst;
    ast.body.map((child: Node): Boolean => {
      if (child.body) {
        rawAst.body.push({
          type: child.type,
          value: child.value,
          block: child.block,
          body: [],
        });
        this.rawAST(child, rawAst.body.slice(-1)[0]);
      } else {
        rawAst.body.push({
          type: child.type,
          value: child.value,
          block: child.block,
        });
        this.rawAST(child);
      }
      return true;
    });
    return this.rawAst;
  }
}