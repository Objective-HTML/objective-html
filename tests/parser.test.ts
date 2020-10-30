import fs from 'fs/promises';
import Parser from 'core/parser';

describe('#Parser', () => {
  describe('#Raw parsing', () => {
    test('should return correct raw AST.', async () => {
      const code: string = await fs.readFile('./tests/content/example.html', 'utf-8');
      const expectedCode: string = await fs.readFile('./tests/content/example.ast.json', 'utf-8');
      const parser: Parser = new Parser(code);
      expect(parser.rawAST()).toEqual(JSON.parse(expectedCode));
    });
  });
});