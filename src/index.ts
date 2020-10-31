import Compiler from 'core/compiler';
import { promises as fs } from 'fs';

async function main() {
  const code: string[] = [];
  try {
    const content: string = await fs.readFile('./sample/index.html', 'utf-8');
    const compiler: Compiler = new Compiler(content, {
      output: 'js',
      cwd: './sample/',
    });
    await compiler.compile();
    return code;
  } catch (exception) {
    throw new Error(exception);
  }
}

async function test() {
  const code: string[] = await main();
  console.log(code);
}

test();