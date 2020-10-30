import { Node } from 'interfaces/parser/node';
import { Parameters } from 'interfaces/compiler/parameters';

export default class Handler {
  private ast: Node;

  private parameters: Parameters;

  constructor(ast: Node, parameters: Parameters) {
    this.parameters = parameters;
    this.ast = ast;
    this.handler(this.ast);
  }

  public handler(tmpAst: Node) {
    if (tmpAst.body) {
      tmpAst.body.map((child: Node) => {
        console.log(child.value);
        this.handler(child);
        return true;
      });
    }
  }
}