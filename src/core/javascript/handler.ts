import { Node } from 'interfaces/parser/node';
import { get } from 'src/block';
import { Block } from 'interfaces/parser/block';
import { Parameters } from 'interfaces/compiler/parameters';
import Compiler from 'core/compiler';
import * as Path from 'path';
import { promises as fs } from 'fs';

export default class Handler {
  private ast: Node;

  private parameters: Parameters;

  private namespace: string;

  private output: string = '';

  constructor(ast: Node, parameters: Parameters) {
    this.parameters = parameters;
    this.ast = ast;
    this.handler(this.ast);
    if (parameters.module) {
      const modulePath: string = Path.resolve(
        Path.join(
          this.parameters.cwd,
          this.toModulePath(parameters.module).replace('.html', '.js'),
        ),
      );
      fs.writeFile(modulePath, this.output);
    } else {
      fs.writeFile(Path.resolve(
        Path.join(
          this.parameters.cwd,
          'main.js',
        ),
      ), `${this.output}${this.namespace}();`);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public toModulePath(path: string): string {
    if (!path.endsWith('.html')) return `${path}.html`;
    return path;
  }

  public handler(tmpAst: Node) {
    if (tmpAst.body) {
      tmpAst.body.map((child: Node) => {
        const block: Block = child.block || { name: '', params: [] };
        const { type, value } = child;
        const { name } = block;
        if (name === 'objective') {
          const namespace: string[] = get(block, 'namespace')[0].value as string[] || ['main'];
          this.namespace = `ns_${namespace.join('_')}`;
          this.output += `export function ns_${namespace.join('_')}() {`;
        } else if (type === 'Text') this.output += `"${value}"`;
        else if (name === 'import') {
          const modules: string[] = get(block, 'src')[0].value as string[];
          modules.map(async (module: string) => {
            try {
              const modulePath: string = Path.resolve(
                Path.join(
                  this.parameters.cwd,
                  this.toModulePath(module),
                ),
              );
              const content: string = await fs.readFile(modulePath, 'utf8');
              const compiler: Compiler = new Compiler(content, {
                output: this.parameters.output,
                cwd: Path.dirname(modulePath),
                module: Path.basename(modulePath),
              });
              await compiler.compile();
            } catch (exception) {
              throw new Error(exception);
            }
            return true;
          });
        } else if (name === 'print') this.output += 'console.log(';
        this.handler(child);
        if (name === 'objective') this.output += '}';
        else if (name === 'print') this.output += ');';
        return true;
      });
    }
  }
}