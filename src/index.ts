import Parser from 'core/parser';
import fs from 'fs/promises';

async function main() {
  try {
    const content: string = await fs.readFile('./sample/index.html', 'utf-8');
    const ast: Parser = new Parser(content);
    console.log(JSON.stringify(ast.rawAST(), null, 2));
  } catch (exception) {
    throw new Error(exception);
  }
}

main();