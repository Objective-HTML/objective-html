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

  protected parse(chars: string, index: number, ast: Node) {
    const char = chars[index];
    if (!char) return;
    if (char === '<') {
      if (this.current.state === 'TEXT') {
        console.log(this.current.block);
      }
      this.current.state = 'BLOCK';
      this.current.block = char;
    } else if (this.current.state === 'BLOCK') {
      if (char === '>') {
        this.current.block += char;
        console.log(this.current.block);
        this.current.block = '';
        this.current.state = '';
      } else {
        this.current.block += char;
      }
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