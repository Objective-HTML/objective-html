import { Current } from 'interfaces/current';
import { Node } from 'interfaces/node';

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

  constructor(private readonly code: string) {
    this.code = this.code
      .split(/\r?\n/g)
      .map((x) => x.trim())
      .filter((x) => x.length > 0)
      .join('');
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
          this.current.block = '';
          this.parse(chars, index + 1, ast.parent);
          return null;
        } if (this.current.block.slice(-2)[0] === '/') {
          ast.body.push({
            type: 'Block',
            value: this.current.block,
            parent: ast,
          });
          this.current.block = '';
          this.parse(chars, index + 1, ast);
          return null;
        }
        ast.body.push({
          type: 'Node',
          value: this.current.block,
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
}