import { Current } from 'interfaces/current';
import { Node } from 'interfaces/node';

export default class Parser {
  private ast: Node = {
    type: 'Program',
    body: [],
    value: '',
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

  protected parse(chars: string, index: number, ast: Node): Function {
    const char = chars[index];
    if (!char) return;
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
          return;
        } if (this.current.block.slice(-2)[0] === '/') {
          ast.body.push({
            type: 'Block',
            value: this.current.block,
            parent: ast,
          });
          this.current.block = '';
          this.parse(chars, index + 1, ast);
          return;
        }
        ast.body.push({
          type: 'Node',
          value: this.current.block,
          parent: ast,
          body: [],
        });
        this.current.block = '';
        this.parse(chars, index + 1, ast.body.slice(-1)[0]);
        return;
      }
      this.current.block += char;
    } else {
      this.current.state = 'TEXT';
      this.current.block += char;
    }
    this.parse(chars, index + 1, ast);
  }

  public init(): Node {
    this.parse(this.code, 0, this.ast);
    return this.ast;
  }
}