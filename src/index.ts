import Compiler from 'core/compiler';
import { promises as fs } from 'fs';

async function main() {
  try {
    const content: string = await fs.readFile('./sample/index.html', 'utf-8');
    const compiler: Compiler = new Compiler(content);
    console.log(compiler.compile());
  } catch (exception) {
    throw new Error(exception);
  }
}

main();